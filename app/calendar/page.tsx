"use client"
import React, { useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

// Demo bookings data
const bookings = [
  { id: 1, title: "Booking #1", date: new Date().toISOString().slice(0, 10), details: "Washer, 10am-11am, John Doe" },
  { id: 2, title: "Booking #2", date: new Date(Date.now() + 86400000).toISOString().slice(0, 10), details: "Dryer, 2pm-3pm, Jane Smith" },
  { id: 3, title: "Booking #3", date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), details: "Washer, 4pm-5pm, Bob Lee" },
]

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)

  // Find bookings for the selected date
  const selectedDateStr = selectedDate ? selectedDate.toISOString().slice(0, 10) : null
  const bookingsForDate = bookings.filter(b => b.date === selectedDateStr)

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-4">Bookings Calendar</h2>
      <div className="bg-white rounded-lg shadow p-2 sm:p-4 w-full overflow-x-auto">
        <Calendar
          onChange={date => {
            setSelectedDate(date as Date)
            setSelectedBooking(null)
          }}
          value={selectedDate}
          tileContent={({ date, view }) => {
            if (view === 'month') {
              const dateStr = date.toISOString().slice(0, 10)
              const hasBooking = bookings.some(b => b.date === dateStr)
              return hasBooking ? <span className="block w-2 h-2 mt-1 mx-auto rounded-full bg-blue-500" /> : null
            }
            return null
          }}
          className="w-full max-w-full"
        />
      </div>
      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Bookings for {selectedDate.toLocaleDateString()}</h3>
          {bookingsForDate.length === 0 ? (
            <div className="text-muted-foreground">No bookings for this date.</div>
          ) : (
            <ul className="space-y-2">
              {bookingsForDate.map(booking => (
                <li key={booking.id} className="bg-blue-100 rounded p-3 cursor-pointer hover:bg-blue-200" onClick={() => setSelectedBooking(booking)}>
                  <div className="font-semibold">{booking.title}</div>
                  <div className="text-xs text-muted-foreground">{booking.details}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {selectedBooking && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow">
          <strong>Booking Details:</strong> {selectedBooking.title}<br />
          <span>{selectedBooking.details}</span>
          <button className="ml-4 text-blue-600 underline" onClick={() => setSelectedBooking(null)}>Close</button>
        </div>
      )}
    </div>
  )
} 
