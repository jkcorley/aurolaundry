import { supabase } from './supabase'

export type MachineStatus = 'idle' | 'in_use' | 'maintenance' | 'out_of_order'

export interface Machine {
  id: number
  type: string
  location: string
  status: MachineStatus
  updated_at: string
}

// Helper function to get a random status
function getRandomStatus(): MachineStatus {
  const statuses: MachineStatus[] = ['idle', 'in_use', 'maintenance', 'out_of_order']
  const weights = [0.6, 0.3, 0.08, 0.02] // 60% idle, 30% in_use, 8% maintenance, 2% out_of_order
  const random = Math.random()
  let sum = 0
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i]
    if (random < sum) return statuses[i]
  }
  return 'idle'
}

// Function to update machine statuses
export async function updateMachineStatuses() {
  try {
    const { data: machines, error } = await supabase
      .from('machines')
      .select('*')

    if (error) {
      console.error('Error fetching machines:', error)
      throw error
    }

    if (!machines || machines.length === 0) {
      console.log('No machines found in the database')
      return
    }

    const updates = machines.map((machine) => ({
      id: machine.id,
      status: getRandomStatus(),
      updated_at: new Date().toISOString(),
    }))

    const { error: updateError } = await supabase
      .from('machines')
      .upsert(updates)

    if (updateError) {
      console.error('Error updating machines:', updateError)
      throw updateError
    }

    console.log('Machine statuses updated successfully')
  } catch (error) {
    console.error('Error updating machine statuses:', error)
    // Don't throw the error, just log it
  }
}

// Function to start periodic updates
export function startMachineStatusUpdates() {
  // Initial update
  updateMachineStatuses()

  // Set up interval for updates every 5 minutes (reduced from 45 for testing)
  const intervalId = setInterval(updateMachineStatuses, 5 * 60 * 1000)

  // Return cleanup function
  return () => clearInterval(intervalId)
}

// Function to initialize machines table with sample data
export async function initializeMachines() {
  try {
    const { data: existingMachines, error: fetchError } = await supabase
      .from('machines')
      .select('*')

    if (fetchError) {
      console.error('Error fetching existing machines:', fetchError)
      throw fetchError
    }

    // If machines already exist, don't initialize
    if (existingMachines && existingMachines.length > 0) {
      console.log('Machines already initialized')
      return
    }

    // Sample machine data
    const machines = [
      { type: 'Washer', location: 'Floor 1', status: 'idle' as MachineStatus },
      { type: 'Washer', location: 'Floor 1', status: 'idle' as MachineStatus },
      { type: 'Dryer', location: 'Floor 1', status: 'idle' as MachineStatus },
      { type: 'Dryer', location: 'Floor 1', status: 'idle' as MachineStatus },
      { type: 'Washer', location: 'Floor 2', status: 'idle' as MachineStatus },
      { type: 'Washer', location: 'Floor 2', status: 'idle' as MachineStatus },
      { type: 'Dryer', location: 'Floor 2', status: 'idle' as MachineStatus },
      { type: 'Dryer', location: 'Floor 2', status: 'idle' as MachineStatus },
    ]

    const { error: insertError } = await supabase
      .from('machines')
      .insert(machines)

    if (insertError) {
      console.error('Error inserting machines:', insertError)
      throw insertError
    }

    console.log('Machines initialized successfully')
  } catch (error) {
    console.error('Error initializing machines:', error)
    // Don't throw the error, just log it
  }
} 