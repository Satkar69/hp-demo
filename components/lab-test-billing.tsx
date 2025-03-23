"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Printer, Check } from "lucide-react";

export function LabTestBilling({ patientData, onComplete }) {
  const [formData, setFormData] = useState({
    testRecommendations: "",
    paymentMethod: "cash",
    paymentReceived: false,
    receiptNumber: "",
  });

  const [selectedTests, setSelectedTests] = useState([]);
  const [isPrinted, setIsPrinted] = useState({
    token: false,
    invoice: false,
  });
  const [labTokenNumber, setLabTokenNumber] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const availableTests = [
    { id: "blood", label: "Blood Test", price: 50 },
    { id: "urine", label: "Urine Analysis", price: 30 },
    { id: "xray", label: "X-Ray", price: 120 },
    { id: "ultrasound", label: "Ultrasound", price: 150 },
    { id: "ecg", label: "ECG", price: 80 },
  ];

  useEffect(() => {
    if (!labTokenNumber) {
      setLabTokenNumber(`L${Math.floor(100000 + Math.random() * 900000)}`);
    }

    if (!invoiceNumber) {
      setInvoiceNumber(`INV-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [labTokenNumber, invoiceNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (value) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }));
  };

  const handlePaymentReceivedChange = () => {
    setFormData((prev) => ({
      ...prev,
      paymentReceived: !prev.paymentReceived,
    }));
  };

  const handleTestSelection = (testId) => {
    setSelectedTests((prev) => {
      const isSelected = prev.includes(testId);

      if (isSelected) {
        return prev.filter((id) => id !== testId);
      } else {
        return [...prev, testId];
      }
    });
  };

  const handlePrintToken = () => {
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
          <title>Lab Test Token</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .token-container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { font-size: 24px; margin-bottom: 5px; }
            .header p { color: #666; margin-top: 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
            .info-item label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 5px; }
            .token-number { font-size: 24px; font-weight: bold; }
            .footer { text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="token-container">
            <div class="header">
              <h1>LAB TEST TOKEN</h1>
              <p>City Hospital</p>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <label>Patient Name:</label>
                <div>${patientData.name}</div>
              </div>
              <div class="info-item">
                <label>Patient ID:</label>
                <div>${patientData.patientId}</div>
              </div>
              <div class="info-item">
                <label>Token Number:</label>
                <div class="token-number">${labTokenNumber}</div>
              </div>
              <div class="info-item">
                <label>Date & Time:</label>
                <div>${formattedDate} ${formattedTime}</div>
              </div>
              <div class="info-item">
                <label>Tests to be performed:</label>
                <div>
                  <ul>
                    ${selectedTests
                      .map((testId) => {
                        const test = availableTests.find(
                          (t) => t.id === testId
                        );
                        return test ? `<li>${test.label}</li>` : "";
                      })
                      .join("")}
                  </ul>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>Please present this token to the laboratory technician</p>
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
            title: "Lab Test Token Printed Successfully",
            description: `Token: ${labTokenNumber}`,
          });

          setIsPrinted((prev) => ({ ...prev, token: true }));
        };
      }, 500);
    };
  };

  const handlePrintInvoice = () => {
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

    const totalBill = selectedTests.reduce((sum, testId) => {
      const test = availableTests.find((t) => t.id === testId);
      return sum + (test ? test.price : 0);
    }, 0);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            .invoice-container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
            .invoice-header { display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; padding-bottom: 15px; margin-bottom: 15px; }
            .company-info h1 { font-size: 24px; margin-bottom: 5px; margin-top: 0; }
            .company-info p { color: #666; margin: 3px 0; font-size: 14px; }
            .invoice-details { text-align: right; }
            .invoice-details p { margin: 3px 0; font-size: 14px; }
            .invoice-details label { font-weight: 500; }
            .patient-info { border-bottom: 1px solid #ddd; padding-bottom: 15px; margin-bottom: 15px; }
            .patient-info h2 { font-size: 18px; margin-bottom: 10px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .info-item label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 3px; }
            .info-item div { font-size: 14px; }
            .services h2 { font-size: 18px; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { font-size: 14px; }
            td { font-size: 14px; }
            .amount { text-align: right; }
            .total { font-weight: bold; }
            .payment-info { margin-top: 20px; }
            .payment-info h2 { font-size: 18px; margin-bottom: 10px; }
            .footer { margin-top: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div class="company-info">
                <h1>INVOICE</h1>
                <p>City Hospital</p>
                <p>123 Medical Avenue</p>
                <p>Healthcare City, HC 12345</p>
                <p>Phone: (123) 456-7890</p>
              </div>
              <div class="invoice-details">
                <p><label>Invoice Number:</label></p>
                <p>${invoiceNumber}</p>
                <p><label>Date:</label></p>
                <p>${formattedDate}</p>
              </div>
            </div>
            <div class="patient-info">
              <h2>Patient Information</h2>
              <div class="info-grid">
                <div class="info-item">
                  <label>Name:</label>
                  <div>${patientData.name}</div>
                </div>
                <div class="info-item">
                  <label>Patient ID:</label>
                  <div>${patientData.patientId}</div>
                </div>
                <div class="info-item">
                  <label>Age:</label>
                  <div>${patientData.age}</div>
                </div>
                <div class="info-item">
                  <label>Gender:</label>
                  <div>${patientData.gender}</div>
                </div>
              </div>
            </div>
            <div class="services">
              <h2>Services</h2>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th class="amount">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${selectedTests
                    .map((testId) => {
                      const test = availableTests.find((t) => t.id === testId);
                      return test
                        ? `
                        <tr>
                          <td>${test.label}</td>
                          <td class="amount">$${test.price}</td>
                        </tr>
                      `
                        : "";
                    })
                    .join("")}
                  <tr class="total">
                    <td class="amount">Total</td>
                    <td class="amount">$${totalBill}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="payment-info">
              <h2>Payment Information</h2>
              <div class="info-grid">
                <div class="info-item">
                  <label>Payment Method:</label>
                  <div>${
                    formData.paymentMethod.charAt(0).toUpperCase() +
                    formData.paymentMethod.slice(1)
                  }</div>
                </div>
                <div class="info-item">
                  <label>Payment Status:</label>
                  <div>${formData.paymentReceived ? "Paid" : "Pending"}</div>
                </div>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for your payment!</p>
              <p>For any billing inquiries, please contact our billing department at billing@cityhospital.com</p>
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
            title: "Invoice Printed Successfully",
            description: `Invoice: ${invoiceNumber}`,
          });

          setIsPrinted((prev) => ({ ...prev, invoice: true }));
        };
      }, 500);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalBill = selectedTests.reduce((sum, testId) => {
      const test = availableTests.find((t) => t.id === testId);
      return sum + (test ? test.price : 0);
    }, 0);

    const labBillingData = {
      ...formData,
      selectedTests,
      totalBill,
      labTokenNumber,
      invoiceNumber,
      labBillingDate: new Date().toISOString(),
    };

    toast({
      title: "Lab Test Billing Complete",
      description: `Token Number: ${labTokenNumber}`,
    });

    onComplete(labBillingData);
  };

  if (!patientData) return <div>Loading patient data...</div>;

  const totalBill = selectedTests.reduce((sum, testId) => {
    const test = availableTests.find((t) => t.id === testId);
    return sum + (test ? test.price : 0);
  }, 0);

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
                  <p className="text-sm text-muted-foreground">
                    {patientData.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Patient ID:</p>
                  <p className="text-sm text-muted-foreground">
                    {patientData.patientId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Age:</p>
                  <p className="text-sm text-muted-foreground">
                    {patientData.age}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Gender:</p>
                  <p className="text-sm text-muted-foreground">
                    {patientData.gender}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="testRecommendations">
                Doctor's Test Recommendations
              </Label>
              <Textarea
                id="testRecommendations"
                name="testRecommendations"
                placeholder="Enter doctor's handwritten test recommendations"
                value={formData.testRecommendations}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label>Select Tests to Perform</Label>
              <div className="rounded-md border p-4">
                <div className="grid grid-cols-2 gap-4">
                  {availableTests.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={test.id}
                          checked={selectedTests.includes(test.id)}
                          onCheckedChange={() => handleTestSelection(test.id)}
                        />
                        <Label htmlFor={test.id}>{test.label}</Label>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ${test.price}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4 font-medium">
                  <span>Total:</span>
                  <span>${totalBill}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                className="rounded-md border p-2"
              >
                <option value="cash">Cash</option>
                <option value="card">Credit/Debit Card</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="paymentReceived"
                checked={formData.paymentReceived}
                onChange={handlePaymentReceivedChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="paymentReceived">Payment Received</Label>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="receiptNumber">Receipt Number</Label>
              <Input
                id="receiptNumber"
                name="receiptNumber"
                placeholder="Enter receipt number"
                value={formData.receiptNumber}
                onChange={handleChange}
                required={formData.paymentReceived}
                disabled={!formData.paymentReceived}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrintToken}
                  disabled={
                    !formData.paymentReceived || selectedTests.length === 0
                  }
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print Token
                  {isPrinted.token && (
                    <Check className="ml-1 h-4 w-4 text-green-600" />
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrintInvoice}
                  disabled={
                    !formData.paymentReceived || selectedTests.length === 0
                  }
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print Invoice
                  {isPrinted.invoice && (
                    <Check className="ml-1 h-4 w-4 text-green-600" />
                  )}
                </Button>
              </div>

              <Button
                type="submit"
                disabled={
                  !formData.paymentReceived || selectedTests.length === 0
                }
              >
                Complete Lab Test Billing
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
