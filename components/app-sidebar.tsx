import { BarChart3, Building2, Calendar, Car, Home, Package, Truck, Users, Wrench } from "lucide-react"
import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const menuItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Laundromats",
    url: "/laundromats",
    icon: Building2,
  },
  {
    title: "Laundromats Map",
    url: "/laundromats-map",
    icon: Building2,
  },
  {
    title: "Laundromats Explore",
    url: "/laundromats-explore",
    icon: Building2,
  },
  {
    title: "Machines",
    url: "/machines",
    icon: Wrench,
  },
  {
    title: "Drivers",
    url: "/drivers",
    icon: Truck,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Bookings",
    url: "/bookings",
    icon: Calendar,
  },
  {
    title: "Supply Orders",
    url: "/orders",
    icon: Package,
  },
  {
    title: "Laundry Products",
    url: "/laundry-products",
    icon: Package,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
]

export function AppSidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-56 md:fixed md:inset-y-0 bg-gradient-to-b from-blue-50 to-white border-r shadow-lg z-40">
      <SidebarHeader className="border-b border-sidebar-border py-6 flex flex-col items-center">
        <Image src="/logo-horizontal.png" alt="Auro Logo" width={120} height={40} priority className="mb-2" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-blue-100 active:bg-blue-200 focus:bg-blue-100">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto flex flex-col items-center py-6">
        <Image src="/placeholder-user.jpg" alt="User" width={48} height={48} className="rounded-full border-2 border-blue-200 shadow" />
        <span className="mt-2 text-sm font-medium">Admin User</span>
      </div>
    </aside>
  )
}
