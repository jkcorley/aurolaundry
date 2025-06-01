"use client"
import { useState } from "react"
import { Calendar, CalendarEvent } from "@/components/ui/calendar" // If not available, use a placeholder

// Mock bookings data
const bookings = [
  { id: 1, title: "Booking #1", date: new Date().toISOString().slice(0, 10) },
  { id: 2, title: "Booking #2", date: new Date(Date.now() + 86400000).toISOString().slice(0, 10) },
  { id: 3, title: "Booking #3", date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10) },
]

export default function CalendarPage() {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Bookings Calendar</h2>
      {/* Replace below with a real calendar component if available */}
      <div className="grid grid-cols-7 gap-2 bg-white rounded-lg shadow p-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-blue-100 rounded p-2 cursor-pointer hover:bg-blue-200"
            onClick={() => setSelected(booking.title)}
          >
            <div className="font-semibold">{booking.title}</div>
            <div className="text-xs text-muted-foreground">{booking.date}</div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow">
          <strong>Booking Details:</strong> {selected}
          <button className="ml-4 text-blue-600 underline" onClick={() => setSelected(null)}>Close</button>
        </div>
      )}
    </div>
  )
} 