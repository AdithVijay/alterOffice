"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Analytics from "./Analytics"

export default function Modal() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        View Analytics
      </Button>
      <Analytics 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}

