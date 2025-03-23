"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export function DoctorConsultation({ patientData, onComplete }) {
  const [formData, setFormData] = useState({
    diagnosis: "",
    requiresLab: false,
    labTests: [],
    prescription: "",
    notes: "",
  })

  const availableTests = [
    { id: "blood", label: "Blood Test" },
    { id: "urine", label: "Urine Analysis" },
    { id: "xray", label: "X-Ray" },
    { id: "ultrasound", label: "Ultrasound" },
    { id: "ecg", label: "ECG" },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLabRequirementChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      requiresLab: value === "yes",
      // Clear lab tests if not required
      labTests: value === "no" ? [] : prev.labTests,
    }))
  }

  const handleTestSelection = (testId) => {
    setFormData((prev) => {
      const isSelected = prev.labTests.includes(testId)

      if (isSelected) {
        return {
          ...prev,
          labTests: prev.labTests.filter((id) => id !== testId),
        }
      } else {
        return {
          ...prev,
          labTests: [...prev.labTests, testId],
        }
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Add consultation timestamp
    const consultationDate = new Date().toISOString()

    const consultationData = {
      ...formData,
      consultationDate,
      doctorName: "Dr. Sarah Johnson", // In a real app, this would come from the logged-in doctor's profile
    }

    toast({
      title: "Consultation Completed",
      description: formData.requiresLab
        ? "Patient referred to laboratory for tests"
        : "Prescription provided to patient",
    })

    // Pass the data to parent component
    onComplete(consultationData)
  }

  if (!patientData) return <div>Loading patient data...</div>

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
                <div>
                  <p className="text-sm font-medium">Age:</p>
                  <p className="text-sm text-muted-foreground">{patientData.age}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Gender:</p>
                  <p className="text-sm text-muted-foreground">{patientData.gender}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Symptoms:</p>
                <p className="text-sm text-muted-foreground">{patientData.symptoms}</p>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                name="diagnosis"
                placeholder="Enter diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label>Does the patient require lab tests?</Label>
              <RadioGroup
                value={formData.requiresLab ? "yes" : "no"}
                onValueChange={handleLabRequirementChange}
                className="flex"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="lab-yes" />
                  <Label htmlFor="lab-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="lab-no" />
                  <Label htmlFor="lab-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.requiresLab && (
              <div className="grid gap-3">
                <Label>Select Required Tests</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableTests.map((test) => (
                    <div key={test.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={test.id}
                        checked={formData.labTests.includes(test.id)}
                        onCheckedChange={() => handleTestSelection(test.id)}
                      />
                      <Label htmlFor={test.id}>{test.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-3">
              <Label htmlFor="prescription">Prescription</Label>
              <Textarea
                id="prescription"
                name="prescription"
                placeholder={formData.requiresLab ? "Will be provided after test results" : "Enter prescription"}
                value={formData.prescription}
                onChange={handleChange}
                required={!formData.requiresLab}
                disabled={formData.requiresLab}
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
              <Button type="submit">Complete Consultation</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

