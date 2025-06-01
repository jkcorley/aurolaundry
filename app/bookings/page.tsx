"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Clock, DollarSign, MapPin } from "lucide-react"
import { supabase } from "@/lib/supabase"
import AddBookingDialog from "./AddBookingDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookings() {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("booking_creation_timestamp", { ascending: false })
      if (error) setError(error.message)
      else setBookings(data || [])
    }
    fetchBookings()
  }, [])

  // Group bookings by date
  const grouped = (bookings || []).reduce(
    (acc, booking) => {
      const date = booking.booking_creation_timestamp
        ? new Date(booking.booking_creation_timestamp).toDateString()
        : "Unknown Date"
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(booking)
      return acc
    },
    {} as Record<string, any[]>,
  )

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
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

  const totalBookings = bookings?.length || 0
  const pendingBookings = (bookings || []).filter((b) => b.current_booking_status?.toLowerCase().includes("pending")).length
  const completedBookings = (bookings || []).filter((b) => b.current_booking_status?.toLowerCase().includes("completed")).length
  const totalRevenue = (bookings || []).reduce(
    (sum, b) => sum + Number.parseFloat(b.actual_cost || b.estimated_cost || "0"),
    0,
  )

  // Sort dates in descending order
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
        <AddBookingDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Bookings grouped by date for easy management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-x-4 md:space-y-0 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search bookings..." className="pl-8 w-full" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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

          {/* Bookings grouped by date */}
          <div className="space-y-6">
            {sortedDates.slice(0, 7).map((date: string) => (
              <div key={date}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{date}</h3>
                  <Badge variant="outline">{grouped[date].length} bookings</Badge>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead className="hidden md:table-cell">Customer</TableHead>
                        <TableHead className="hidden md:table-cell">Service</TableHead>
                        <TableHead className="hidden md:table-cell">Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden sm:table-cell">Payment</TableHead>
                        <TableHead className="hidden md:table-cell">Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grouped[date].map((booking: any) => (
                        <TableRow key={booking.booking_id}>
                          <TableCell className="font-medium">{booking.booking_id}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div>
                              <div className="font-medium">{booking.user_full_name_snapshot}</div>
                              <div className="text-sm text-muted-foreground">{booking.user_phone_snapshot}</div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{booking.service_name_snapshot}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-[200px]">{booking.laundromat_name_snapshot}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.current_booking_status)}</TableCell>
                          <TableCell className="hidden sm:table-cell">{getPaymentBadge(booking.payment_status)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            ${booking.actual_cost || booking.estimated_cost || "0.00"}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                                  View/Edit Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Booking Details</DialogTitle>
                                </DialogHeader>
                                {selectedBooking && (
                                  <form
                                    className="space-y-2"
                                    onSubmit={async (e) => {
                                      e.preventDefault();
                                      // Save logic here (e.g., call supabase update)
                                      // Optionally show a loading state or success message
                                    }}
                                  >
                                    <div>
                                      <label className="block text-sm font-medium">Customer Name</label>
                                      <input
                                        className="w-full border rounded px-2 py-1"
                                        value={selectedBooking.user_full_name_snapshot}
                                        onChange={e => setSelectedBooking({ ...selectedBooking, user_full_name_snapshot: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium">Phone</label>
                                      <input
                                        className="w-full border rounded px-2 py-1"
                                        value={selectedBooking.user_phone_snapshot}
                                        onChange={e => setSelectedBooking({ ...selectedBooking, user_phone_snapshot: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium">Service</label>
                                      <input
                                        className="w-full border rounded px-2 py-1"
                                        value={selectedBooking.service_name_snapshot}
                                        onChange={e => setSelectedBooking({ ...selectedBooking, service_name_snapshot: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium">Status</label>
                                      <input
                                        className="w-full border rounded px-2 py-1"
                                        value={selectedBooking.current_booking_status}
                                        onChange={e => setSelectedBooking({ ...selectedBooking, current_booking_status: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium">Payment Status</label>
                                      <input
                                        className="w-full border rounded px-2 py-1"
                                        value={selectedBooking.payment_status}
                                        onChange={e => setSelectedBooking({ ...selectedBooking, payment_status: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium">Amount</label>
                                      <input
                                        className="w-full border rounded px-2 py-1"
                                        value={selectedBooking.actual_cost || selectedBooking.estimated_cost || "0.00"}
                                        onChange={e => setSelectedBooking({ ...selectedBooking, actual_cost: e.target.value })}
                                      />
                                    </div>
                                    <div className="flex justify-end pt-2">
                                      <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Save</button>
                                    </div>
                                  </form>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
