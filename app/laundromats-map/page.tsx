"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import type { Laundromat } from "@/lib/types"

const Map = dynamic(() => import("@/components/Map"), { ssr: false })

export default function LaundromatsMapPage() {
  const [laundromats, setLaundromats] = useState<Laundromat[]>([])
  const [selected, setSelected] = useState<Laundromat | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    async function fetchLaundromats() {
      const { data, error } = await supabase.from("participating_laundromats").select("*")
      if (error) {
        console.error("Error fetching laundromats from Supabase:", error)
        setLaundromats([])
      } else {
        setLaundromats(data || [])
      }
    }
    fetchLaundromats()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(null)
      )
    }
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-4 flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Laundromats Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px] rounded-xl overflow-hidden mb-4">
            <Map laundromats={laundromats} />
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Button variant="secondary">Find Nearest</Button>
            <Button variant="outline">Explore All</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 