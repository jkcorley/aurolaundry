"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Truck, Search, Phone, Mail, Calendar } from "lucide-react"
import AddDriverDialog from "./AddDriverDialog"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null)

  useEffect(() => {
    async function fetchDrivers() {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .order("full_name")
      if (error) {
        setDrivers([])
      } else {
        setDrivers(data || [])
      }
      setLoading(false)
    }
    fetchDrivers()
  }, [])

  const getStatusBadge = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case "busy":
        return <Badge className="bg-yellow-100 text-yellow-800">Busy</Badge>
      case "offline":
        return <Badge variant="destructive">Offline</Badge>
      case "on_delivery":
        return <Badge className="bg-blue-100 text-blue-800">On Delivery</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return <div className="p-4">Loading drivers...</div>
  }

  const activeDrivers = drivers.filter((d) => d.is_active).length
  const availableDrivers = drivers.filter((d) => d.current_status?.toLowerCase() === "available").length
  const busyDrivers = drivers.filter(
    (d) => d.current_status?.toLowerCase() === "busy" || d.current_status?.toLowerCase() === "on_delivery",
  ).length
  const offlineDrivers = drivers.filter((d) => d.current_status?.toLowerCase() === "offline").length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Drivers</h2>
        <AddDriverDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drivers.length}</div>
            <p className="text-xs text-muted-foreground">{activeDrivers} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableDrivers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Busy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{busyDrivers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{offlineDrivers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Management</CardTitle>
          <CardDescription>Manage driver availability and view performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search drivers..." className="pl-8 w-full" />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="on_delivery">On Delivery</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Active</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Registered</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Update</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.driver_id}>
                    <TableCell className="hidden sm:table-cell">
                      <Checkbox
                        checked={driver.is_active}
                        aria-label={`Toggle ${driver.full_name} availability`}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{driver.full_name}</div>
                        <div className="text-sm text-muted-foreground">ID: {driver.driver_id}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {driver.phone_number}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" />
                          {driver.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <div className="font-medium">{driver.vehicle_type}</div>
                        <div className="text-sm text-muted-foreground">{driver.license_plate}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(driver.current_status || "")}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {driver.date_registered ? new Date(driver.date_registered).toLocaleDateString() : ""}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm text-muted-foreground">
                        {driver.last_status_update ? new Date(driver.last_status_update).toLocaleString() : ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedDriver(driver)}>
                            View/Edit Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Driver Details</DialogTitle>
                          </DialogHeader>
                          {selectedDriver && (
                            <form
                              className="space-y-2"
                              onSubmit={async (e) => {
                                e.preventDefault();
                                // Save logic here (e.g., call supabase update)
                                // Optionally show a loading state or success message
                              }}
                            >
                              <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                  className="w-full border rounded px-2 py-1"
                                  value={selectedDriver.full_name}
                                  onChange={e => setSelectedDriver({ ...selectedDriver, full_name: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                  className="w-full border rounded px-2 py-1"
                                  value={selectedDriver.email}
                                  onChange={e => setSelectedDriver({ ...selectedDriver, email: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium">Phone</label>
                                <input
                                  className="w-full border rounded px-2 py-1"
                                  value={selectedDriver.phone_number}
                                  onChange={e => setSelectedDriver({ ...selectedDriver, phone_number: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium">Vehicle Type</label>
                                <input
                                  className="w-full border rounded px-2 py-1"
                                  value={selectedDriver.vehicle_type}
                                  onChange={e => setSelectedDriver({ ...selectedDriver, vehicle_type: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium">License Plate</label>
                                <input
                                  className="w-full border rounded px-2 py-1"
                                  value={selectedDriver.license_plate}
                                  onChange={e => setSelectedDriver({ ...selectedDriver, license_plate: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium">Status</label>
                                <input
                                  className="w-full border rounded px-2 py-1"
                                  value={selectedDriver.current_status}
                                  onChange={e => setSelectedDriver({ ...selectedDriver, current_status: e.target.value })}
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

          {drivers.map(
            (driver) =>
              driver.admin_notes && (
                <div className="mt-4 p-3 bg-muted rounded-md" key={driver.driver_id}>
                  <p className="text-sm text-muted-foreground">
                    <strong>Admin Notes:</strong> {driver.admin_notes}
                  </p>
                </div>
              ),
          )}
        </CardContent>
      </Card>
    </div>
  )
}
