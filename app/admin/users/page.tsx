"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users as UsersIcon, CheckCircle, Clock } from "lucide-react"

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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/data/Auro%20Backend%20Data%20-%20Users_List.csv")
      .then((res) => res.text())
      .then((csvText) => setUsers(parseCSV(csvText)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // Stats
  const totalUsers = users.length
  const activeUsers = users.filter((u) => (u.status || u.Status || "").toLowerCase() === "active").length
  const pendingUsers = users.filter((u) => (u.status || u.Status || "").toLowerCase() === "pending").length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
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
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.slice(0, 20).map((user) => (
                    <TableRow key={user["User ID"] || user.id}>
                      <TableCell>{user["User ID"] || user.id}</TableCell>
                      <TableCell>{user["Name"] || user.name}</TableCell>
                      <TableCell>{user["Email"] || user.email}</TableCell>
                      <TableCell>
                        <Badge>{user.status || user.Status}</Badge>
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