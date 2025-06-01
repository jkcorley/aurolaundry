"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WashingMachine } from "lucide-react"
import MachinesTable from "../../../app/machines/MachinesTable"
import AddMachineDialog from "../../../app/machines/AddMachineDialog"

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

export default function AdminMachinesPage() {
  const [machines, setMachines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/data/Auro%20Backend%20Data%20-%20machines%20(1).csv")
      .then((res) => res.text())
      .then((csvText) => setMachines(parseCSV(csvText)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // Stats
  const totalMachines = machines.length
  const washerCount = machines.filter((m) => (m.machine_type || "").toLowerCase() === "washer").length
  const dryerCount = machines.filter((m) => (m.machine_type || "").toLowerCase() === "dryer").length
  const activeCount = machines.filter((m) => (m.current_status || m.status || "").toLowerCase() === "active" || (m.current_status || m.status || "").toLowerCase() === "online").length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Laundry Machines</h2>
        <AddMachineDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
            <WashingMachine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMachines}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Washers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{washerCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dryers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dryerCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>All Machines</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">Error: {error}</div>
          ) : (
            <MachinesTable machines={machines} />
          )}
        </CardContent>
      </Card>
    </div>
  )
} 