"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, ChevronDown, ChevronRight, Mail, Phone, MapPin, Calendar, Trash2 } from "lucide-react"
import AddUserDialog from "./AddUserDialog"
import { supabase } from "@/lib/supabase"
import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase.from("users").select("*").order("user_id")
        if (error) throw error
        setUsers(data || [])
      } catch (error) {
        console.error("Error loading users from Supabase:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const toggleUserExpansion = (userId: string) => {
    const newExpanded = new Set(expandedUsers)
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId)
    } else {
      newExpanded.add(userId)
    }
    setExpandedUsers(newExpanded)
  }

  const getStatusBadge = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    setEditLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: selectedUser.full_name,
          email: selectedUser.email,
          phone_number: selectedUser.phone_number,
          user_role: selectedUser.user_role,
          account_status: selectedUser.account_status,
          default_pickup_address_street: selectedUser.default_pickup_address_street,
          default_pickup_address_city: selectedUser.default_pickup_address_city,
          default_pickup_address_state: selectedUser.default_pickup_address_state,
          default_pickup_address_zip: selectedUser.default_pickup_address_zip,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", selectedUser.user_id)

      if (error) throw error

      setMessage("User updated successfully!")
      // Refresh the users list
      const { data } = await supabase.from("users").select("*").order("user_id")
      setUsers(data || [])
    } catch (error: any) {
      setMessage("Error updating user: " + error.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return

    setDeleteLoading(userId)
    setMessage(null)

    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("user_id", userId)

      if (error) throw error

      setMessage("User deleted successfully!")
      // Refresh the users list
      const { data } = await supabase.from("users").select("*").order("user_id")
      setUsers(data || [])
    } catch (error: any) {
      setMessage("Error deleting user: " + error.message)
    } finally {
      setDeleteLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading users...</div>
        </div>
      </div>
    )
  }

  const activeUsers = users.filter((u) => (u.account_status || u.status) === "Active").length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Users</h2>
        <AddUserDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage user accounts and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-8 w-full" />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="User role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                  <TableHead className="w-[50px] hidden sm:table-cell" />
                <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Address</TableHead>
                <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.slice(0, 20).map((user) => {
                const isExpanded = expandedUsers.has(user.user_id)
                return (
                  <React.Fragment key={user.user_id}>
                    <TableRow key={user.user_id}>
                        <TableCell className="hidden sm:table-cell">
                        <Button variant="ghost" size="sm" onClick={() => toggleUserExpansion(user.user_id)}>
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.full_name || `${user.first_name || ""} ${user.last_name || ""}`}</div>
                          <div className="text-sm text-muted-foreground">ID: {user.user_id}</div>
                          <div className="text-sm text-muted-foreground">Role: {user.user_role || user.role}</div>
                        </div>
                      </TableCell>
                        <TableCell className="hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone_number || user.phone}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                        <TableCell className="hidden md:table-cell">
                        <div className="text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.default_pickup_address_street || user.address}
                          </div>
                          {(user.default_pickup_address_city || user.default_pickup_address_state || user.default_pickup_address_zip) && (
                            <div className="text-muted-foreground text-xs">
                              {[user.default_pickup_address_city, user.default_pickup_address_state, user.default_pickup_address_zip].filter(Boolean).join(", ")}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.account_status || user.status)}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {user.last_login_timestamp || user.last_login ? (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(user.last_login_timestamp || user.last_login).toLocaleDateString()}
                            </div>
                          ) : (
                            "Never"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User Details</DialogTitle>
                              </DialogHeader>
                              {selectedUser && (
                                <form className="space-y-2" onSubmit={handleEdit}>
                                  <div>
                                    <label className="block text-sm font-medium">Name</label>
                                    <input
                                      className="w-full border rounded px-2 py-1"
                                      value={selectedUser.full_name || `${selectedUser.first_name || ""} ${selectedUser.last_name || ""}`}
                                      onChange={e => setSelectedUser({ ...selectedUser, full_name: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium">Email</label>
                                    <input
                                      className="w-full border rounded px-2 py-1"
                                      value={selectedUser.email}
                                      onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium">Phone</label>
                                    <input
                                      className="w-full border rounded px-2 py-1"
                                      value={selectedUser.phone_number || selectedUser.phone}
                                      onChange={e => setSelectedUser({ ...selectedUser, phone_number: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium">Role</label>
                                    <input
                                      className="w-full border rounded px-2 py-1"
                                      value={selectedUser.user_role || selectedUser.role}
                                      onChange={e => setSelectedUser({ ...selectedUser, user_role: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium">Status</label>
                                    <input
                                      className="w-full border rounded px-2 py-1"
                                      value={selectedUser.account_status || selectedUser.status}
                                      onChange={e => setSelectedUser({ ...selectedUser, account_status: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium">Address</label>
                                    <input
                                      className="w-full border rounded px-2 py-1"
                                      value={selectedUser.default_pickup_address_street || selectedUser.address}
                                      onChange={e => setSelectedUser({ ...selectedUser, default_pickup_address_street: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium">City/State/Zip</label>
                                    <input
                                      className="w-full border rounded px-2 py-1"
                                      value={[
                                        selectedUser.default_pickup_address_city,
                                        selectedUser.default_pickup_address_state,
                                        selectedUser.default_pickup_address_zip
                                      ].filter(Boolean).join(", ")}
                                      onChange={e => {
                                        const [city, state, zip] = e.target.value.split(",").map(s => s.trim())
                                        setSelectedUser({
                                          ...selectedUser,
                                          default_pickup_address_city: city,
                                          default_pickup_address_state: state,
                                          default_pickup_address_zip: zip
                                        })
                                      }}
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
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                            onClick={() => handleDelete(user.user_id)}
                            disabled={deleteLoading === user.user_id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {/* Expanded row for future details if needed */}
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
      {message && (
        <div className={`p-4 rounded-md ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}
    </div>
  )
}
