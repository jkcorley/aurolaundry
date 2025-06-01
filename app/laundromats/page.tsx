import { getCachedCSV } from "@/lib/csv-loader"
import type { Laundromat } from "@/lib/types"
import LaundromatsClient from "./LaundromatsClient"

async function getLaundromats() {
  try {
    const laundromats = (await getCachedCSV("laundromats")) as Laundromat[]
    return laundromats.map((laundromat, index) => ({
      ...laundromat,
      // Mock machine counts for each laundromat
      totalMachines: Math.floor(Math.random() * 15) + 8,
      activeMachines: Math.floor(Math.random() * 12) + 6,
      revenue: Math.floor(Math.random() * 10000) + 5000,
    }))
  } catch (error) {
    console.error("Error loading laundromats:", error)
    return []
  }
}

export default async function LaundromatsPage() {
  const laundromats = await getLaundromats()
  return <LaundromatsClient laundromats={laundromats} />
}
