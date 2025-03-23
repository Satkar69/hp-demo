"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientRegistration } from "@/components/patient-registration"
import { TokenGeneration } from "@/components/token-generation"
import { LabTestBilling } from "@/components/lab-test-billing"
import { TestResultsEntry } from "@/components/test-results-entry"
import { Pharmacy } from "@/components/pharmacy"
import { PatientSummary } from "@/components/patient-summary"

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [patientData, setPatientData] = useState(null)
  const [tokenData, setTokenData] = useState(null)
  const [labBillingData, setLabBillingData] = useState(null)
  const [resultData, setResultData] = useState(null)
  const [pharmacyData, setPharmacyData] = useState(null)

  const handlePatientRegistration = (data) => {
    setPatientData(data)
    setCurrentStep(2)
  }

  const handleTokenGeneration = (data) => {
    setTokenData(data)
    setCurrentStep(3)
  }

  const handleLabBilling = (data) => {
    setLabBillingData(data)
    setCurrentStep(4)
  }

  const handleTestResults = (data) => {
    setResultData(data)
    setCurrentStep(5)
  }

  const handlePharmacy = (data) => {
    setPharmacyData(data)
    setCurrentStep(6)
  }

  const resetDemo = () => {
    setCurrentStep(1)
    setPatientData(null)
    setTokenData(null)
    setLabBillingData(null)
    setResultData(null)
    setPharmacyData(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Hospital Workflow Demo</h1>
        <p className="mt-2 text-muted-foreground">
          Step through the complete hospital workflow from patient registration to checkout
        </p>
      </div>

      <div className="mb-8">
        <Tabs value={`step-${currentStep}`} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="step-1" disabled={currentStep !== 1}>
              Registration
            </TabsTrigger>
            <TabsTrigger value="step-2" disabled={currentStep !== 2}>
              Token Generation
            </TabsTrigger>
            <TabsTrigger value="step-3" disabled={currentStep !== 3}>
              Lab Billing
            </TabsTrigger>
            <TabsTrigger value="step-4" disabled={currentStep !== 4}>
              Test Results
            </TabsTrigger>
            <TabsTrigger value="step-5" disabled={currentStep !== 5}>
              Pharmacy
            </TabsTrigger>
            <TabsTrigger value="step-6" disabled={currentStep !== 6}>
              Summary
            </TabsTrigger>
          </TabsList>
          <TabsContent value="step-1">
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Patient Registration</CardTitle>
                <CardDescription>Register a new patient in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <PatientRegistration onComplete={handlePatientRegistration} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="step-2">
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Consultation Token Generation</CardTitle>
                <CardDescription>Generate and print consultation token and invoice</CardDescription>
              </CardHeader>
              <CardContent>
                <TokenGeneration patientData={patientData} onComplete={handleTokenGeneration} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="step-3">
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Laboratory Test Billing</CardTitle>
                <CardDescription>Generate bills for lab tests and print tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <LabTestBilling patientData={patientData} onComplete={handleLabBilling} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="step-4">
            <Card>
              <CardHeader>
                <CardTitle>Step 4: Test Results Entry</CardTitle>
                <CardDescription>Enter test results manually and generate reports</CardDescription>
              </CardHeader>
              <CardContent>
                <TestResultsEntry patientData={patientData} labData={labBillingData} onComplete={handleTestResults} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="step-5">
            <Card>
              <CardHeader>
                <CardTitle>Step 5: Pharmacy</CardTitle>
                <CardDescription>Process handwritten prescription and update inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <Pharmacy patientData={patientData} onComplete={handlePharmacy} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="step-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Checkout Complete</CardTitle>
                <CardDescription>All patient records have been updated in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <PatientSummary
                  patientData={patientData}
                  tokenData={tokenData}
                  labBillingData={labBillingData}
                  resultData={resultData}
                  pharmacyData={pharmacyData}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={resetDemo}>Start New Demo</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

