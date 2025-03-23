"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Check, Printer } from "lucide-react"

export function PatientSummary({ patientData, tokenData, labBillingData, resultData, pharmacyData }) {
  if (!patientData) return <div>No patient data available</div>

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const testLabels = {
    blood: "Blood Test",
    urine: "Urine Analysis",
    xray: "X-Ray",
    ultrasound: "Ultrasound",
    ecg: "ECG",
  }

  const handlePrintSummary = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-2">
          <Check className="h-6 w-6 rounded-full bg-primary text-primary-foreground p-1" />
          <h3 className="text-lg font-medium">Patient Visit Complete</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          All records have been saved in the system for future reference.
        </p>
      </div>

      <Card className="print-section">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold">Patient Information</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Name:</p>
              <p className="text-muted-foreground">{patientData.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Patient ID:</p>
              <p className="text-muted-foreground">{patientData.patientId}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Age:</p>
              <p className="text-muted-foreground">{patientData.age}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Gender:</p>
              <p className="text-muted-foreground">{patientData.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Contact:</p>
              <p className="text-muted-foreground">{patientData.contact}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Registration Date:</p>
              <p className="text-muted-foreground">{formatDate(patientData.registrationDate)}</p>
            </div>
          </div>

          <Separator className="my-6" />

          {tokenData && (
            <>
              <h3 className="text-xl font-bold">Consultation Details</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium">Token Number:</p>
                  <p className="text-muted-foreground">{tokenData.tokenNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Consultation Type:</p>
                  <p className="text-muted-foreground">{tokenData.consultationType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Consultation Fee:</p>
                  <p className="text-muted-foreground">${tokenData.consultationFee}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Token Generated:</p>
                  <p className="text-muted-foreground">{formatDate(tokenData.tokenDate)}</p>
                </div>
              </div>

              <Separator className="my-6" />
            </>
          )}

          {labBillingData && (
            <>
              <h3 className="text-xl font-bold">Laboratory Tests</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium">Lab Token Number:</p>
                  <p className="text-muted-foreground">{labBillingData.labTokenNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tests Performed:</p>
                  <ul className="list-inside list-disc text-muted-foreground">
                    {labBillingData.selectedTests.map((test) => (
                      <li key={test}>{testLabels[test]}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium">Doctor's Recommendations:</p>
                  <p className="whitespace-pre-line text-muted-foreground">{labBillingData.testRecommendations}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Lab Billing Date:</p>
                  <p className="text-muted-foreground">{formatDate(labBillingData.labBillingDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Bill:</p>
                  <p className="text-muted-foreground">${labBillingData.totalBill}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Receipt Number:</p>
                  <p className="text-muted-foreground">{labBillingData.receiptNumber}</p>
                </div>
              </div>

              <Separator className="my-6" />
            </>
          )}

          {resultData && (
            <>
              <h3 className="text-xl font-bold">Test Results</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium">Lab Technician:</p>
                  <p className="text-muted-foreground">{resultData.technicianName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Results Entry Date:</p>
                  <p className="text-muted-foreground">{formatDate(resultData.resultEntryDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Test Results:</p>
                  <div className="mt-2 space-y-2">
                    {Object.entries(resultData.testResults).map(([testId, result]) => (
                      <div key={testId} className="rounded-md border p-3">
                        <p className="font-medium">{testLabels[testId] || testId}:</p>
                        <p className="whitespace-pre-line text-muted-foreground">{result}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {resultData.notes && (
                  <div>
                    <p className="text-sm font-medium">Additional Notes:</p>
                    <p className="whitespace-pre-line text-muted-foreground">{resultData.notes}</p>
                  </div>
                )}
              </div>

              <Separator className="my-6" />
            </>
          )}

          {pharmacyData && (
            <>
              <h3 className="text-xl font-bold">Pharmacy Details</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium">Handwritten Prescription:</p>
                  <p className="whitespace-pre-line text-muted-foreground">{pharmacyData.handwrittenPrescription}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Medicines Purchased:</p>
                  <ul className="list-inside text-muted-foreground">
                    {pharmacyData.medicines.map((med, index) => (
                      <li key={index}>
                        {med.name} - {med.quantity} units (${med.price * med.quantity})
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium">Pharmacy Date:</p>
                  <p className="text-muted-foreground">{formatDate(pharmacyData.pharmacyDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Bill:</p>
                  <p className="text-muted-foreground">${pharmacyData.totalBill}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Receipt Number:</p>
                  <p className="text-muted-foreground">{pharmacyData.receiptNumber}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" onClick={handlePrintSummary} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print Summary
        </Button>
      </div>
    </div>
  )
}

