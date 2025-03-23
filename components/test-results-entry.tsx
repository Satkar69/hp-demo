"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Printer, Check } from "lucide-react";

export function TestResultsEntry({ patientData, labData, onComplete }) {
  const [formData, setFormData] = useState({
    patientTokenNumber: "",
    technicianName: "",
    notes: "",
  });

  const [testResults, setTestResults] = useState({});
  const [isPrinted, setIsPrinted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestResultChange = (testId, value) => {
    setTestResults((prev) => ({ ...prev, [testId]: value }));
  };

  const handlePrintResults = () => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast({
        title: "Error",
        description:
          "Could not open print window. Please check your popup blocker.",
        variant: "destructive",
      });
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Results Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            .report-container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { font-size: 24px; margin-bottom: 5px; }
            .header p { color: #666; margin-top: 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
            .info-item label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 5px; }
            .test-results { margin-bottom: 25px; }
            .test-results h4 { font-size: 18px; margin-bottom: 10px; }
            .test-result-item { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; }
            .test-result-item h5 { font-size: 16px; margin-bottom: 5px; }
            .notes { margin-bottom: 25px; }
            .notes h4 { font-size: 18px; margin-bottom: 10px; }
            .footer { text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="report-container">
            <div class="header">
              <h1>LABORATORY TEST RESULTS</h1>
              <p>City Hospital</p>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <label>Patient Name:</label>
                <div>${patientData?.name || "Patient Name"}</div>
              </div>
              <div class="info-item">
                <label>Patient ID:</label>
                <div>${
                  patientData?.patientId || formData.patientTokenNumber
                }</div>
              </div>
              <div class="info-item">
                <label>Lab Technician:</label>
                <div>${formData.technicianName}</div>
              </div>
              <div class="info-item">
                <label>Date & Time:</label>
                <div>${formattedDate} ${formattedTime}</div>
              </div>
            </div>
            <div class="test-results">
              <h4>Test Results:</h4>
              ${Object.entries(testResults)
                .map(
                  ([testId, result]) => `
                <div class="test-result-item">
                  <h5>${testLabels[testId] || testId}</h5>
                  <p class="whitespace-pre-line">${result}</p>
                </div>
              `
                )
                .join("")}
            </div>
            ${
              formData.notes &&
              `
              <div class="notes">
                <h4>Additional Notes:</h4>
                <p class="whitespace-pre-line">${formData.notes}</p>
              </div>
            `
            }
            <div class="footer">
              <p>Please present these results to your doctor</p>
              <p>Thank you for choosing City Hospital</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = function () {
      setTimeout(() => {
        printWindow.print();
        printWindow.onafterprint = function () {
          printWindow.close();

          toast({
            title: "Test Results Printed Successfully",
            description: "Test results report has been printed",
          });

          setIsPrinted(true);
        };
      }, 500);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const resultData = {
      ...formData,
      testResults,
      resultEntryDate: new Date().toISOString(),
    };

    toast({
      title: "Test Results Entry Complete",
      description: "Results have been saved in the system",
    });

    onComplete(resultData);
  };

  const selectedTests = labData?.selectedTests || [];

  const testLabels = {
    blood: "Blood Test",
    urine: "Urine Analysis",
    xray: "X-Ray",
    ultrasound: "Ultrasound",
    ecg: "ECG",
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="patientTokenNumber">
                Patient Lab Token Number
              </Label>
              <Input
                id="patientTokenNumber"
                name="patientTokenNumber"
                placeholder="Enter patient's lab token number"
                value={formData.patientTokenNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="technicianName">Lab Technician Name</Label>
              <Input
                id="technicianName"
                name="technicianName"
                placeholder="Enter your name"
                value={formData.technicianName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-3">
              <h3 className="text-lg font-medium">Test Results Entry</h3>
              <div className="rounded-md border p-4">
                <div className="space-y-4">
                  {selectedTests.length > 0 ? (
                    selectedTests.map((test) => (
                      <div key={test} className="grid gap-2">
                        <Label htmlFor={`result-${test}`}>
                          {testLabels[test]}
                        </Label>
                        <Textarea
                          id={`result-${test}`}
                          placeholder={`Enter ${testLabels[test]} results`}
                          value={testResults[test] || ""}
                          onChange={(e) =>
                            handleTestResultChange(test, e.target.value)
                          }
                          required
                        />
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="result-blood">Blood Test</Label>
                        <Textarea
                          id="result-blood"
                          placeholder="Enter Blood Test results"
                          value={testResults.blood || ""}
                          onChange={(e) =>
                            handleTestResultChange("blood", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="result-urine">Urine Analysis</Label>
                        <Textarea
                          id="result-urine"
                          placeholder="Enter Urine Analysis results"
                          value={testResults.urine || ""}
                          onChange={(e) =>
                            handleTestResultChange("urine", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="result-other">Other Tests</Label>
                        <Textarea
                          id="result-other"
                          placeholder="Enter other test results"
                          value={testResults.other || ""}
                          onChange={(e) =>
                            handleTestResultChange("other", e.target.value)
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
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

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrintResults}
                disabled={Object.keys(testResults).length === 0}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Test Results
              </Button>

              {isPrinted && (
                <div className="flex items-center text-sm text-green-600">
                  <Check className="mr-1 h-4 w-4" />
                  Printed Successfully
                </div>
              )}

              <Button
                type="submit"
                disabled={Object.keys(testResults).length === 0} // Removed !isPrinted check
              >
                Complete Results Entry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
