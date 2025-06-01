"use client"

import { useEffect, useState } from "react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import type { Laundromat } from "@/lib/types"

interface MapComponentProps {
  laundromats: Laundromat[]
}

const containerStyle = {
  width: "100%",
  height: "100%"
}

export default function MapComponent({ laundromats }: MapComponentProps) {
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.0060 })

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
  })

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCenter({ lat: 40.7128, lng: -74.0060 })
      )
    }
  }, [])

  if (!isLoaded) return <div>Loading map...</div>

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={11}
    >
      {laundromats.map((laundromat) => (
        <Marker
          key={laundromat.Name}
          position={{ lat: laundromat.Latitude, lng: laundromat.Longitude }}
        />
      ))}
    </GoogleMap>
  )
} 