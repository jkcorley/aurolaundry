'use client'

import { Loader2 } from 'lucide-react'

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <Loader2 className={`h-4 w-4 animate-spin ${className}`} />
  )
} 