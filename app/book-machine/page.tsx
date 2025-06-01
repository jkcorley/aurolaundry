"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function BookMachinePage() {
  const [machines, setMachines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchAvailable, setSearchAvailable] = useState("")
  const [searchBooked, setSearchBooked] = useState("")
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchMachines()
  }, [])

  async function fetchMachines() {
    setLoading(true)
    const { data, error } = await supabase.from("machines").select("*")
    setMachines(data || [])
    setLoading(false)
  }

  async function bookMachine(id: string) {
    setUpdating(id)
    await supabase.from("machines").update({ current_status: "Booked" }).eq("machine_id", id)
    await fetchMachines()
    setUpdating(null)
  }

  async function unbookMachine(id: string) {
    setUpdating(id)
    await supabase.from("machines").update({ current_status: "Available" }).eq("machine_id", id)
    await fetchMachines()
    setUpdating(null)
  }

  const available = machines.filter(m => (m.current_status || "").toLowerCase() === "available" && (m.machine_id + " " + (m.machine_type || "") + " " + (m.laundromat_id || "")).toLowerCase().includes(searchAvailable.toLowerCase()))
  const booked = machines.filter(m => (m.current_status || "").toLowerCase() === "booked" && (m.machine_id + " " + (m.machine_type || "") + " " + (m.laundromat_id || "")).toLowerCase().includes(searchBooked.toLowerCase()))

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Available Machines */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Available Machines</h2>
        <Input
          placeholder="Search machines..."
          className="mb-4"
          value={searchAvailable}
          onChange={e => setSearchAvailable(e.target.value)}
        />
        {loading ? <div>Loading...</div> : (
          <div className="space-y-2">
            {available.map(m => (
              <div key={m.machine_id} className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition">
                <div>
                  <span className="font-semibold text-blue-700">{m.machine_id}</span>
                  {m.machine_type && <span className="ml-2 text-gray-500">- {m.machine_type}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">AVAILABLE</span>
                  <Button size="sm" disabled={updating === m.machine_id} onClick={() => bookMachine(m.machine_id)}>
                    {updating === m.machine_id ? "Booking..." : "Book"}
                  </Button>
                </div>
              </div>
            ))}
            {available.length === 0 && <div className="text-muted-foreground text-sm">No available machines.</div>}
          </div>
        )}
      </div>
      {/* Booked Machines */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Booked Machines</h2>
        <Input
          placeholder="Search machines..."
          className="mb-4"
          value={searchBooked}
          onChange={e => setSearchBooked(e.target.value)}
        />
        {loading ? <div>Loading...</div> : (
          <div className="space-y-2">
            {booked.map(m => (
              <div key={m.machine_id} className="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition">
                <div>
                  <span className="font-semibold text-blue-700">{m.machine_id}</span>
                  {m.machine_type && <span className="ml-2 text-gray-500">- {m.machine_type}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">BOOKED</span>
                  <Button size="sm" variant="outline" disabled={updating === m.machine_id} onClick={() => unbookMachine(m.machine_id)}>
                    {updating === m.machine_id ? "Unbooking..." : "Unbook"}
                  </Button>
                </div>
              </div>
            ))}
            {booked.length === 0 && <div className="text-muted-foreground text-sm">No booked machines.</div>}
          </div>
        )}
      </div>
    </div>
  )
} 