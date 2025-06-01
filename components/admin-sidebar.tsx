"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Home", href: "/admin" },
  { label: "Machines", href: "/admin/machines" },
  { label: "Laundromats", href: "/admin/laundromats" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Users", href: "/admin/users" },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-56 bg-white border-r min-h-screen flex flex-col">
      <div className="p-6 font-bold text-xl border-b">Admin</div>
      <nav className="flex-1 flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded hover:bg-gray-100 transition-colors font-medium ${pathname === item.href ? "bg-gray-100 text-blue-600" : "text-gray-700"}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
} 