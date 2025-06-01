"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, DollarSign, Clock, CheckCircle, XCircle, MapPin, Eye, Trash2 } from "lucide-react"
import AddOrderDialog from "./AddOrderDialog"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface OrderItem {
  name: string
  quantity: number
  price: string
}

interface Order {
  supply_order_id: string
  order_timestamp: string
  order_status: string
  total_order_amount: string
  items: OrderItem[]
  user_full_name_snapshot?: string
  user_id?: string
  delivery_address_street?: string
  delivery_address_city?: string
  delivery_address_state?: string
  delivery_address_zip?: string
  payment_status?: string
  subtotal_amount?: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingActions, setPendingActions] = useState<Set<string>>(new Set())
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadOrders() {
      try {
        const { data, error } = await supabase
          .from("supply_orders")
          .select("*")
          .order("order_timestamp", { ascending: false })
        if (error) throw error
        setOrders(data || [])
      } catch (error) {
        console.error("Error loading orders:", error)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  const handleApprove = (orderId: string) => {
    setPendingActions((prev) => new Set(prev).add(orderId))
    // Simulate API call
    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.supply_order_id === orderId ? { ...order, order_status: "Approved" } : order,
        ),
      )
      setPendingActions((prev) => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    }, 1000)
  }

  const handleDecline = (orderId: string) => {
    setPendingActions((prev) => new Set(prev).add(orderId))
    // Simulate API call
    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.supply_order_id === orderId ? { ...order, order_status: "Declined" } : order,
        ),
      )
      setPendingActions((prev) => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "declined":
        return <Badge variant="destructive">Declined</Badge>
      case "shipped":
        return <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return

    setEditLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from("supply_orders")
        .update({
          order_status: selectedOrder.order_status,
          total_order_amount: selectedOrder.total_order_amount,
          payment_status: selectedOrder.payment_status,
          updated_at: new Date().toISOString(),
        })
        .eq("supply_order_id", selectedOrder.supply_order_id)

      if (error) throw error

      setMessage("Order updated successfully!")
      // Refresh the orders list
      const { data } = await supabase
        .from("supply_orders")
        .select("*")
        .order("order_timestamp", { ascending: false })
      setOrders(data || [])
    } catch (error: any) {
      setMessage("Error updating order: " + error.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) return

    setDeleteLoading(orderId)
    setMessage(null)

    try {
      const { error } = await supabase
        .from("supply_orders")
        .delete()
        .eq("supply_order_id", orderId)

      if (error) throw error

      setMessage("Order deleted successfully!")
      // Refresh the orders list
      const { data } = await supabase
        .from("supply_orders")
        .select("*")
        .order("order_timestamp", { ascending: false })
      setOrders(data || [])
    } catch (error: any) {
      setMessage("Error deleting order: " + error.message)
    } finally {
      setDeleteLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading orders...</div>
        </div>
      </div>
    )
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.order_status?.toLowerCase() === "pending").length
  const approvedOrders = orders.filter((o) => o.order_status?.toLowerCase() === "approved").length
  const totalRevenue = orders.reduce((sum, o) => sum + Number.parseFloat(o.total_order_amount || "0"), 0)

  function OrderDetails({ order }: { order: Order }) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">Order ID</h3>
            <p>{order.supply_order_id}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">Date</h3>
            <p>{order.order_timestamp ? new Date(order.order_timestamp).toLocaleDateString() : ""}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">Status</h3>
            <Badge variant={order.order_status === "Delivered" ? "default" : "secondary"}>
              {order.order_status}
            </Badge>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">Total</h3>
            <p>${Number.parseFloat(order.total_order_amount || "0").toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Items</h3>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item: OrderItem, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">${Number.parseFloat(item.price || "0").toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Supply Orders</h2>
        <AddOrderDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Orders Management</CardTitle>
          <CardDescription>Review and approve supply orders from users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-x-4 md:space-y-0 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders..." className="pl-8 w-full" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {message && (
            <div className={`p-4 rounded-md ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {message}
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead className="hidden md:table-cell">Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Delivery Address</TableHead>
                  <TableHead className="hidden sm:table-cell">Order Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Payment</TableHead>
                  <TableHead className="hidden md:table-cell">Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.supply_order_id}>
                    <TableCell className="font-medium">{order.supply_order_id}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <div className="font-medium">{order.user_full_name_snapshot}</div>
                        <div className="text-sm text-muted-foreground">ID: {order.user_id}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-start">
                        <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <div>{order.delivery_address_street}</div>
                          <div className="text-muted-foreground">
                            {order.delivery_address_city}, {order.delivery_address_state} {order.delivery_address_zip}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{order.order_timestamp ? new Date(order.order_timestamp).toLocaleDateString() : ""}</TableCell>
                    <TableCell>{getStatusBadge(order.order_status)}</TableCell>
                    <TableCell className="hidden sm:table-cell">{getPaymentBadge(order.payment_status || "")}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <div className="font-medium">${order.total_order_amount}</div>
                        <div className="text-xs text-muted-foreground">Subtotal: ${order.subtotal_amount || "0.00"}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Order Details</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <form className="space-y-2" onSubmit={handleEdit}>
                                <div>
                                  <label className="block text-sm font-medium">Order ID</label>
                                  <input
                                    className="w-full border rounded px-2 py-1"
                                    value={selectedOrder.supply_order_id}
                                    onChange={e => setSelectedOrder({ ...selectedOrder, supply_order_id: e.target.value })}
                                    disabled
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium">Status</label>
                                  <input
                                    className="w-full border rounded px-2 py-1"
                                    value={selectedOrder.order_status}
                                    onChange={e => setSelectedOrder({ ...selectedOrder, order_status: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium">Total Amount</label>
                                  <input
                                    className="w-full border rounded px-2 py-1"
                                    value={selectedOrder.total_order_amount}
                                    onChange={e => setSelectedOrder({ ...selectedOrder, total_order_amount: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium">Payment Status</label>
                                  <input
                                    className="w-full border rounded px-2 py-1"
                                    value={selectedOrder.payment_status}
                                    onChange={e => setSelectedOrder({ ...selectedOrder, payment_status: e.target.value })}
                                  />
                                </div>
                                <div className="flex justify-end pt-2">
                                  <Button type="submit" disabled={editLoading}>
                                    {editLoading ? "Saving..." : "Save Changes"}
                                  </Button>
                                </div>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          onClick={() => order.supply_order_id && handleDelete(order.supply_order_id)}
                          disabled={deleteLoading === order.supply_order_id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
