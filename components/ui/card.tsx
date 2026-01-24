import * as React from 'react'
import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      /* Eliminamos el borde marcado y el shadow gris por algo más sutil y limpio */
      className={cn(
        'bg-white text-card-foreground flex flex-col gap-4 overflow-hidden transition-all duration-300 group',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      /* Reducimos el padding para que la imagen y el texto respiren mejor */
      className={cn(
        'flex flex-col gap-1.5 px-0', // px-0 porque la imagen suele ir a sangre
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      /* Aquí aplicamos la magia: Serif, tracking apretado y tamaño elegante */
      className={cn(
        'font-serif text-2xl text-black tracking-tighter leading-tight group-hover:text-black/60 transition-colors',
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      /* Texto más pequeño y espaciado para que parezca una descripción de revista */
      className={cn('text-black/40 text-[11px] uppercase tracking-[0.1em] font-medium', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-0 pt-2', className)} // px-0 para alinear con el header
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-0 pt-4', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
