"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ClassForm } from "../class-form"

interface ClassFormWrapperProps {
  classItem: any
  instructors: any[]
  programs: any[]
}

export function ClassFormWrapper({ classItem, instructors, programs }: ClassFormWrapperProps) {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => router.push("/admin/clases"), 200)
  }

  const handleSuccess = () => {
    router.push("/admin/clases")
    router.refresh()
  }

  return (
    <ClassForm
      open={open}
      onOpenChange={handleClose}
      classItem={classItem}
      instructors={instructors}
      programs={programs}
      onSuccess={handleSuccess}
    />
  )
}
