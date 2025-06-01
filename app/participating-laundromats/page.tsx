import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, MapPin, Phone, Clock, Search, ExternalLink } from "lucide-react"
import { getCachedCSV } from "@/lib/csv-loader"
import { ErrorBoundary } from "@/components/error-boundary"
import { Loading } from "@/components/loading"
import { Laundromat, Machine, BoroughCounts } from "@/app/types/laundromat"
import { Suspense } from "react"

async function getParticipatingLaundromats(): Promise<Laundromat[]> {
  try {
    const laundromats = (await getCachedCSV("participating_laundromats" as const)) as Laundromat[]
    return laundromats.map((laundromat) => ({
      ...laundromat,
      totalMachines: Math.floor(Math.random() * 15) + 8,
      activeMachines: Math.floor(Math.random() * 12) + 6,
    }))
  } catch (error) {
    console.error("Error loading participating laundromats:", error)
    throw new Error("Failed to load participating laundromats")
  }
}

async function getAllMachines(): Promise<Machine[]> {
  try {
    return await getCachedCSV("machines") as Machine[]
  } catch (error) {
    console.error("Error loading machines:", error)
    throw new Error("Failed to load machines")
  }
}

function ParticipatingLaundromatsContent() {
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <ParticipatingLaundromatsPage />
      </ErrorBoundary>
    </Suspense>
  )
}

async function ParticipatingLaundromatsPage() {
  const laundromats = await getParticipatingLaundromats()
  const machines = await getAllMachines()

  const totalLocations = laundromats.length
  const avgRating = laundromats.length > 0
    ? laundromats.reduce((sum, l) => sum + Number.parseFloat(l.rating?.toString() || "0"), 0) / laundromats.length
    : 0.0
  const totalMachines = laundromats.reduce((sum, l) => sum + l.totalMachines, 0)
  const activeMachines = laundromats.reduce((sum, l) => sum + l.activeMachines, 0)

  // Group by borough
  const boroughCounts = laundromats.reduce(
    (acc: BoroughCounts, l) => {
      const borough = l.borough || "Unknown"
      acc[borough] = (acc[borough] || 0) + 1
      return acc
    },
    {} as BoroughCounts,
  )

  // Helper to count active machines for a laundromat
  function countActiveMachines(laundromat_id: string): number {
    return machines.filter(
      (m) => m.laundromat_id === laundromat_id && m.status?.toLowerCase() === "active"
    ).length
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Participating Laundromats</h2>
        <Button className="w-full sm:w-auto">
          <Building2 className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLocations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)} ⭐</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMachines}</div>
            <p className="text-xs text-muted-foreground">{activeMachines} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Borough</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.entries(boroughCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {Object.entries(boroughCounts).sort(([, a], [, b]) => b - a)[0]?.[1] || 0} locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Participating Laundromat Locations</CardTitle>
          <CardDescription>All registered participating laundromat locations in NYC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search participating laundromats..." className="pl-8 w-full" />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by borough" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">All Boroughs</SelectItem>
                {Object.keys(boroughCounts).map((borough) => (
                  <SelectItem key={borough} value={borough.toLowerCase()}>
                    {borough}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="name" value="name">Name</SelectItem>
                <SelectItem key="rating" value="rating">Rating</SelectItem>
                <SelectItem key="machines" value="machines">Machine Count</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Neighborhood</TableHead>
                  <TableHead>Borough</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Active Machines</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {laundromats.map((laundromat) => (
                  <TableRow key={laundromat.laundromat_id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{laundromat.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {laundromat.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{laundromat.neighborhood}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{laundromat.borough || "Unknown"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-medium">{laundromat.rating}</span>
                        <span className="ml-1">⭐</span>
                        <span className="text-sm text-muted-foreground ml-1">({laundromat.total_user_ratings})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-medium">{countActiveMachines(laundromat.laundromat_id)}</span>
                        <span className="text-sm text-muted-foreground ml-1">/ {laundromat.totalMachines}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{laundromat.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ParticipatingLaundromatsContent 