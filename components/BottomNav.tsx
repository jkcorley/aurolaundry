"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Building2,
  ShoppingCart,
  Users,
  Settings2,
  Map,
  MoreHorizontal,
  Calendar,
  Wrench,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Laundromats", href: "/laundromats", icon: Building2 },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Users", href: "/users", icon: Users },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Book a Machine", href: "/book-machine", icon: Wrench },
  { name: "Settings", href: "/settings", icon: Settings2 },
];

const moreItems = [
  { name: "Laundromats Map", href: "/laundromats-map", icon: Map },
  { name: "Explore", href: "/laundromats-explore", icon: Map },
  { name: "Analytics", href: "/analytics", icon: Map },
  { name: "Laundry Products", href: "/laundry-products", icon: ShoppingCart },
  { name: "Machines", href: "/machines", icon: Settings2 },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Book a Machine", href: "/book-machine", icon: Wrench },
  // Add more as needed
];

export function BottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow md:hidden flex justify-between px-2 py-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center flex-1 py-2 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className={cn("h-6 w-6 mb-1", isActive && "fill-primary")} />
              {item.name}
            </Link>
          );
        })}
        {/* More button */}
        <button
          className="flex flex-col items-center flex-1 py-2 text-xs font-medium transition-colors text-muted-foreground hover:text-primary"
          onClick={() => setShowMore((v) => !v)}
          aria-label="More"
        >
          <MoreHorizontal className="h-6 w-6 mb-1" />
          More
        </button>
      </nav>
      {/* More menu popover/sheet with icons and transitions */}
      {showMore && (
        <div className="absolute bottom-14 left-0 right-0 mx-2 bg-white rounded-xl shadow-xl border p-2 flex flex-col z-50 animate-in fade-in">
          {moreItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium"
              onClick={() => setShowMore(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>
      )}
      {/* Desktop/Tablet Sidebar */}
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-56 md:flex-col md:bg-white md:border-r md:shadow-lg md:z-40">
        <div className="flex flex-col h-full py-6">
          <div className="flex flex-col gap-2 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-lg text-base font-medium transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className={cn("h-6 w-6", isActive && "fill-primary")} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            {/* More section for desktop */}
            <div className="mt-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-6">More</div>
              {moreItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-6 py-2 rounded-lg text-sm font-medium hover:bg-muted text-muted-foreground hover:text-primary"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
} 