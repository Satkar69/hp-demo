"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MedicineManagement } from "@/components/medicine-management"
import { ShieldCheck, ArrowLeft } from "lucide-react"

export default function MedicinesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/super-admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Medicine Management</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Medicine Inventory</CardTitle>
            <CardDescription>Add, edit, and delete medicines in the inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <MedicineManagement />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

