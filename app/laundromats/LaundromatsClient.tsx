"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Trash2 } from "lucide-react"
import AddLaundromatDialog from "./AddLaundromatDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import type { Laundromat } from "@/lib/types"
import { supabase } from "@/lib/supabase"

function LaundromatDetails({ laundromat }: { laundromat: Laundromat & { totalMachines: number; activeMachines: number; revenue: number } }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Name</h3>
          <p>{laundromat.Name}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Address</h3>
          <p>{laundromat.Address}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Borough</h3>
          <p>{laundromat.Borough}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Rating</h3>
          <p>{laundromat.Rating} / 5</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Total Machines</h3>
          <p>{laundromat.totalMachines}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Active Machines</h3>
          <p>{laundromat.activeMachines}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground">Revenue</h3>
          <p>${laundromat.revenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default function LaundromatsClient({ laundromats }: { laundromats: (Laundromat & { totalMachines: number; activeMachines: number; revenue: number })[] }) {
  const [selectedLaundromat, setSelectedLaundromat] = useState<Laundromat | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const totalLocations = laundromats.length
  const avgRating = laundromats.length > 0
    ? laundromats.reduce((sum, l) => sum + Number.parseFloat(l.Rating || "0"), 0) / laundromats.length
    : 0.0
  const totalMachines = laundromats.reduce((sum, l) => sum + l.totalMachines, 0)
  const activeMachines = laundromats.reduce((sum, l) => sum + l.activeMachines, 0)

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLaundromat) return

    setEditLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from("participating_laundromats")
        .update({
          name: selectedLaundromat.Name,
          address: selectedLaundromat.Address,
          borough: selectedLaundromat.Borough,
          rating: selectedLaundromat.Rating,
          updated_at: new Date().toISOString(),
        })
        .eq("laundromat_id", selectedLaundromat["Laundromat ID"])

      if (error) throw error

      setMessage("Laundromat updated successfully!")
      // Refresh the page to show updated data
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error: any) {
      setMessage("Error updating laundromat: " + error.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (laundromatId: string) => {
    if (!window.confirm("Are you sure you want to delete this laundromat? This action cannot be undone.")) return

    setDeleteLoading(laundromatId)
    setMessage(null)

    try {
      const { error } = await supabase
        .from("participating_laundromats")
        .delete()
        .eq("laundromat_id", laundromatId)

      if (error) throw error

      setMessage("Laundromat deleted successfully!")
      // Refresh the page to show updated data
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error: any) {
      setMessage("Error deleting laundromat: " + error.message)
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMachines}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Machines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMachines}</div>
          </CardContent>
        </Card>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Laundromats</CardTitle>
            <CardDescription>Manage your laundromat locations</CardDescription>
          </div>
          <AddLaundromatDialog />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {laundromats.map((laundromat) => (
                  <TableRow key={laundromat["Laundromat ID"]}>
                    <TableCell className="font-medium">{laundromat.Name}</TableCell>
                    <TableCell className="hidden md:table-cell">{laundromat.Address}</TableCell>
                    <TableCell>
                      <Badge variant={laundromat.activeMachines > 0 ? "default" : "secondary"}>
                        {laundromat.activeMachines > 0 ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedLaundromat(laundromat)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Laundromat Details</DialogTitle>
                            </DialogHeader>
                            {selectedLaundromat && (
                              <form className="space-y-2" onSubmit={handleEdit}>
                                <div>
                                  <label className="block text-sm font-medium">Name</label>
                                  <input
                                    className="w-full border rounded px-2 py-1"
                                    value={selectedLaundromat?.Name || ""}
                                    onChange={e => setSelectedLaundromat({ ...selectedLaundromat, Name: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium">Address</label>
                                  <input
                                    className="w-full border rounded px-2 py-1"
                                    value={selectedLaundromat?.Address || ""}
                                    onChange={e => setSelectedLaundromat({ ...selectedLaundromat, Address: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium">Borough</label>
                                  <input
                                    className="w-full border rounded px-2 py-1"
                                    value={selectedLaundromat?.Borough || ""}
                                    onChange={e => setSelectedLaundromat({ ...selectedLaundromat, Borough: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium">Rating</label>
                                  <input
                                    className="w-full border rounded px-2 py-1"
                                    value={selectedLaundromat?.Rating || ""}
                                    onChange={e => setSelectedLaundromat({ ...selectedLaundromat, Rating: e.target.value })}
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
                          onClick={() => handleDelete(laundromat["Laundromat ID"])}
                          disabled={deleteLoading === laundromat["Laundromat ID"]}
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