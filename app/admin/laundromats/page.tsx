"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, MapPin, Phone, Clock, Search, ExternalLink } from "lucide-react"
import AddLaundromatDialog from "../../../app/laundromats/AddLaundromatDialog"

function parseCSV(csvText: string): Record<string, any>[] {
  const lines = csvText.trim().split("\n")
  if (lines.length < 2) return []
  const headers = lines[0].split(",").map((header) => header.replace(/"/g, "").trim())
  const data: Record<string, any>[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((value) => value.replace(/"/g, "").trim())
    const row: Record<string, any> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || null
    })
    data.push(row)
  }
  return data
}

export default function AdminLaundromatsPage() {
  const [laundromats, setLaundromats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/data/Auro%20Backend%20Data%20-%20All_NYC_Laundromats%20(2).csv")
      .then((res) => res.text())
      .then((csvText) => setLaundromats(parseCSV(csvText)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // Stats
  const totalLocations = laundromats.length
  const avgRating = laundromats.length > 0
    ? laundromats.reduce((sum, l) => sum + Number.parseFloat(l.Rating || "0"), 0) / laundromats.length
    : 0.0
  const totalMachines = laundromats.reduce((sum, l) => sum + (parseInt(l.totalMachines) || 0), 0)
  const activeMachines = laundromats.reduce((sum, l) => sum + (parseInt(l.activeMachines) || 0), 0)
  const boroughCounts = laundromats.reduce(
    (acc: Record<string, number>, l) => {
      const borough = l.Borough || "Unknown"
      acc[borough] = (acc[borough] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">All Laundromats</h2>
        <AddLaundromatDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)} ⭐</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMachines}</div>
            <p className="text-xs text-muted-foreground">{activeMachines} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Borough</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.entries(boroughCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {Object.entries(boroughCounts).sort(([, a], [, b]) => b - a)[0]?.[1] || 0} locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Laundromat Locations</CardTitle>
          <CardDescription>All registered laundromat locations in NYC</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">Error: {error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Neighborhood</TableHead>
                    <TableHead>Borough</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Machines</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laundromats.slice(0, 20).map((laundromat) => (
                    <TableRow key={laundromat["Laundromat ID"]}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{laundromat.Name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {laundromat.Address}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{laundromat.Neighborhood}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{laundromat.Borough || "Unknown"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium">{laundromat.Rating}</span>
                          <span className="ml-1">⭐</span>
                          <span className="text-sm text-muted-foreground ml-1">({laundromat["Total User Ratings"]})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">{laundromat.totalMachines}</span>
                          <span className="text-sm text-muted-foreground"> total</span>
                          <div className="text-sm text-green-600">{laundromat.activeMachines} active</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {laundromat.Phone && (
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {laundromat.Phone}
                            </div>
                          )}
                          {laundromat["Hours of Operation"] && (
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              <span className="truncate">{laundromat["Hours of Operation"].slice(0, 20)}...</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                          {laundromat["Google Maps URL"] && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={laundromat["Google Maps URL"]} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 