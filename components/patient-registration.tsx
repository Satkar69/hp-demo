"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export function PatientRegistration({ onComplete }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "male",
    contact: "",
    address: "",
    symptoms: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Generate a unique patient ID
    const patientId = `P${Math.floor(100000 + Math.random() * 900000)}`

    // Add registration timestamp
    const registrationDate = new Date().toISOString()

    const patientData = {
      ...formData,
      patientId,
      registrationDate,
    }

    toast({
      title: "Patient Registered Successfully",
      description: `Patient ID: ${patientId}`,
    })

    // Pass the data to parent component
    onComplete(patientData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Patient Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label>Gender</Label>
                <RadioGroup value={formData.gender} onValueChange={handleGenderChange} className="flex">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                name="contact"
                placeholder="Contact number"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea
                id="symptoms"
                name="symptoms"
                placeholder="Describe symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Register Patient</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

