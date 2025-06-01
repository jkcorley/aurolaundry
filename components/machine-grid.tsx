'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function MachineGrid() {
  const [machines, setMachines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const { data, error } = await supabase
          .from('machines')
          .select('*')
          .order('id')
        if (error) throw error
        setMachines(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch machines')
      } finally {
        setLoading(false)
      }
    }
    fetchMachines()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine: any) => (
            <tr key={machine.id}>
              <td className="p-2 border">{machine.id}</td>
              <td className="p-2 border">{machine.type}</td>
              <td className="p-2 border">{machine.location}</td>
              <td className="p-2 border">{machine.status}</td>
              <td className="p-2 border">{machine.updated_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 