"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export function Laboratory({ patientData, consultationData, onComplete }) {
  const [formData, setFormData] = useState({
    sampleCollected: false,
    paymentReceived: false,
    receiptNumber: "",
    notes: "",
  })

  const [testResults, setTestResults] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const handleTestResultChange = (testId, value) => {
    setTestResults((prev) => ({ ...prev, [testId]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Calculate total bill
    const testPrices = {
      blood: 50,
      urine: 30,
      xray: 120,
      ultrasound: 150,
      ecg: 80,
    }

    const selectedTests = consultationData.labTests || []
    const totalBill = selectedTests.reduce((sum, test) => sum + (testPrices[test] || 0), 0)

    // Add lab timestamp
    const labDate = new Date().toISOString()

    const labData = {
      ...formData,
      testResults,
      selectedTests,
      totalBill,
      labDate,
    }

    toast({
      title: "Lab Tests Processed",
      description: `Total bill: $${totalBill}. Receipt #${formData.receiptNumber}`,
    })

    // Pass the data to parent component
    onComplete(labData)
  }

  if (!patientData || !consultationData) return <div>Loading data...</div>

  const selectedTests = consultationData.labTests || []
  if (selectedTests.length === 0) return <div>No lab tests requested</div>

  const testLabels = {
    blood: "Blood Test",
    urine: "Urine Analysis",
    xray: "X-Ray",
    ultrasound: "Ultrasound",
    ecg: "ECG",
  }

  const testPrices = {
    blood: 50,
    urine: 30,
    xray: 120,
    ultrasound: 150,
    ecg: 80,
  }

  const totalBill = selectedTests.reduce((sum, test) => sum + (testPrices[test] || 0), 0)

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
              <h3 className="text-lg font-medium">Requested Tests</h3>
              <div className="rounded-md border p-4">
                <div className="space-y-4">
                  {selectedTests.map((test) => (
                    <div key={test} className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`result-${test}`}>{testLabels[test]}</Label>
                        <span className="text-sm text-muted-foreground">${testPrices[test]}</span>
                      </div>
                      <Textarea
                        id={`result-${test}`}
                        placeholder={`Enter ${testLabels[test]} results`}
                        value={testResults[test] || ""}
                        onChange={(e) => handleTestResultChange(test, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <h3 className="text-lg font-medium">Billing Information</h3>
              <div className="rounded-md border p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-medium">
                    <span>Total Bill:</span>
                    <span>${totalBill}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="paymentReceived"
                      checked={formData.paymentReceived}
                      onChange={() => handleCheckboxChange("paymentReceived")}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="paymentReceived">Payment Received</Label>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="receiptNumber">Receipt Number</Label>
                    <Input
                      id="receiptNumber"
                      name="receiptNumber"
                      placeholder="Enter receipt number"
                      value={formData.receiptNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sampleCollected"
                checked={formData.sampleCollected}
                onChange={() => handleCheckboxChange("sampleCollected")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="sampleCollected">Sample Collected</Label>
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
              <Button type="submit" disabled={!formData.sampleCollected || !formData.paymentReceived}>
                Complete Lab Tests
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

