"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export function TestResults({ patientData, labData, onComplete }) {
  const [formData, setFormData] = useState({
    analysis: "",
    prescription: "",
    notes: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Add review timestamp
    const reviewDate = new Date().toISOString()

    const resultData = {
      ...formData,
      reviewDate,
      doctorName: "Dr. Sarah Johnson", // In a real app, this would come from the logged-in doctor's profile
    }

    toast({
      title: "Test Results Reviewed",
      description: "Prescription has been provided",
    })

    // Pass the data to parent component
    onComplete(resultData)
  }

  if (!patientData || !labData) return <div>Loading data...</div>

  const testLabels = {
    blood: "Blood Test",
    urine: "Urine Analysis",
    xray: "X-Ray",
    ultrasound: "Ultrasound",
    ecg: "ECG",
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">Patient Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Name:</p>
                  <p className="text-sm text-muted-foreground">{patientData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Patient ID:</p>
                  <p className="text-sm text-muted-foreground">{patientData.patientId}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <h3 className="text-lg font-medium">Test Results</h3>
              <div className="rounded-md border p-4">
                <div className="space-y-4">
                  {labData.selectedTests.map((test) => (
                    <div key={test} className="grid gap-2">
                      <Label>{testLabels[test]}</Label>
                      <div className="rounded-md bg-muted p-3 text-sm">
                        {labData.testResults[test] || "No results recorded"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="analysis">Analysis</Label>
              <Textarea
                id="analysis"
                name="analysis"
                placeholder="Enter analysis of test results"
                value={formData.analysis}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="prescription">Prescription</Label>
              <Textarea
                id="prescription"
                name="prescription"
                placeholder="Enter prescription"
                value={formData.prescription}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Enter additional notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Complete Review</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

