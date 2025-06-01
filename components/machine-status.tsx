'use client'

import { MachineStatus } from '@/lib/machine-status'
import { cn } from '@/lib/utils'
import {
  WashingMachine,
  Clock,
  Wrench,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'

interface MachineStatusProps {
  status: MachineStatus
  lastUpdate?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const statusConfig = {
  idle: {
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    label: 'Available',
  },
  in_use: {
    icon: WashingMachine,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    label: 'In Use',
  },
  maintenance: {
    icon: Wrench,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    label: 'Maintenance',
  },
  out_of_order: {
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    label: 'Out of Order',
  },
}

const sizeConfig = {
  sm: {
    icon: 'h-4 w-4',
    text: 'text-xs',
    container: 'p-1.5',
  },
  md: {
    icon: 'h-5 w-5',
    text: 'text-sm',
    container: 'p-2',
  },
  lg: {
    icon: 'h-6 w-6',
    text: 'text-base',
    container: 'p-2.5',
  },
}

export function MachineStatusIndicator({
  status,
  lastUpdate,
  size = 'md',
  showLabel = true,
}: MachineStatusProps) {
  const config = statusConfig[status]
  const sizeStyles = sizeConfig[size]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'rounded-full flex items-center justify-center',
          config.bgColor,
          sizeStyles.container
        )}
      >
        <Icon className={cn(config.color, sizeStyles.icon)} />
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className={cn('font-medium', sizeStyles.text)}>
            {config.label}
          </span>
          {lastUpdate && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          )}
        </div>
      )}
    </div>
  )
} 