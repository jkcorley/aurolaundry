"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, WashingMachine, Flame } from "lucide-react"

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
    <div className="p-2 sm:p-4 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h1 className="text-xl font-bold">Book a Machine</h1>
        <Button size="sm" variant="outline" onClick={fetchMachines} disabled={loading || updating !== null}>
          Refresh
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : machines.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">No machines found.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Available Machines */}
          <div>
            <div className="sticky top-0 z-10 bg-white/90 py-2 mb-2 flex flex-col gap-2 border-b">
              <h2 className="text-lg font-semibold">Available Machines</h2>
              <Input
                placeholder="Search available..."
                className="w-full"
                value={searchAvailable}
                onChange={e => setSearchAvailable(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              {available.length === 0 ? (
                <div className="text-muted-foreground text-sm">No available machines.</div>
              ) : available.map(m => (
                <div key={m.machine_id} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition shadow-sm">
                  <div className="flex items-center gap-2">
                    {m.machine_type?.toLowerCase().includes("dryer") ? <Flame className="h-5 w-5 text-orange-500" /> : <WashingMachine className="h-5 w-5 text-blue-700" />}
                    <span className="font-semibold text-blue-700">{m.machine_id}</span>
                    {m.machine_type && <span className="ml-2 text-gray-500">- {m.machine_type}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">AVAILABLE</span>
                    <Button size="sm" className="min-w-[70px]" disabled={updating === m.machine_id} onClick={() => bookMachine(m.machine_id)}>
                      {updating === m.machine_id ? <Loader2 className="animate-spin h-4 w-4" /> : "Book"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Booked Machines */}
          <div>
            <div className="sticky top-0 z-10 bg-white/90 py-2 mb-2 flex flex-col gap-2 border-b">
              <h2 className="text-lg font-semibold">Booked Machines</h2>
              <Input
                placeholder="Search booked..."
                className="w-full"
                value={searchBooked}
                onChange={e => setSearchBooked(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              {booked.length === 0 ? (
                <div className="text-muted-foreground text-sm">No booked machines.</div>
              ) : booked.map(m => (
                <div key={m.machine_id} className="flex items-center justify-between p-3 rounded-lg bg-red-50 hover:bg-red-100 transition shadow-sm">
                  <div className="flex items-center gap-2">
                    {m.machine_type?.toLowerCase().includes("dryer") ? <Flame className="h-5 w-5 text-orange-500" /> : <WashingMachine className="h-5 w-5 text-blue-700" />}
                    <span className="font-semibold text-blue-700">{m.machine_id}</span>
                    {m.machine_type && <span className="ml-2 text-gray-500">- {m.machine_type}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">BOOKED</span>
                    <Button size="sm" variant="outline" className="min-w-[90px]" disabled={updating === m.machine_id} onClick={() => unbookMachine(m.machine_id)}>
                      {updating === m.machine_id ? <Loader2 className="animate-spin h-4 w-4" /> : "Unbook"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
