"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Analytics from "./Analytics"

export default function Modal({urlId}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        View Analytics
      </Button>
      <Analytics 
      urlId={urlId}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}

