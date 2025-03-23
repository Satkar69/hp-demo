"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Printer, Check } from "lucide-react";

export function TokenGeneration({ patientData, onComplete }) {
  const [formData, setFormData] = useState({
    consultationType: "general",
    consultationFee: 50,
    paymentMethod: "cash",
    paymentReceived: false,
  });

  const [isPrinted, setIsPrinted] = useState({
    token: false,
    invoice: false,
  });
  const [tokenNumber, setTokenNumber] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const tokenSectionRef = useRef(null);
  const invoiceSectionRef = useRef(null);

  const consultationTypes = [
    { id: "general", label: "General Consultation", fee: 50 },
    { id: "specialist", label: "Specialist Consultation", fee: 100 },
    { id: "emergency", label: "Emergency Consultation", fee: 150 },
  ];

  // Generate numbers on component mount
  useEffect(() => {
    if (!tokenNumber) {
      setTokenNumber(`T${Math.floor(100000 + Math.random() * 900000)}`);
    }

    if (!invoiceNumber) {
      setInvoiceNumber(`INV-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [tokenNumber, invoiceNumber]);

  const handleConsultationTypeChange = (value) => {
    const selectedType = consultationTypes.find((type) => type.id === value);
    setFormData((prev) => ({
      ...prev,
      consultationType: value,
      consultationFee: selectedType ? selectedType.fee : 50,
    }));
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

  const handlePrintToken = () => {
    if (!tokenSectionRef.current) return;

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

    // Create the token content directly in the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Consultation Token</title>
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
              padding: 20px;
              max-width: 600px;
              margin: 0 auto;
            }
            .token-container {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 24px;
              margin-bottom: 5px;
            }
            .header p {
              color: #666;
              margin-top: 0;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 25px;
            }
            .info-item label {
              display: block;
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 5px;
            }
            .token-number {
              font-size: 24px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="token-container">
            <div class="header">
              <h1>CONSULTATION TOKEN</h1>
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
                <div class="token-number">${tokenNumber}</div>
              </div>
              <div class="info-item">
                <label>Date & Time:</label>
                <div>${formattedDate} ${formattedTime}</div>
              </div>
              <div class="info-item">
                <label>Consultation Type:</label>
                <div>${
                  consultationTypes.find(
                    (type) => type.id === formData.consultationType
                  )?.label
                }</div>
              </div>
              <div class="info-item">
                <label>Fee Paid:</label>
                <div>$${formData.consultationFee}</div>
              </div>
            </div>
            
            <div class="footer">
              <p>Please present this token to the doctor</p>
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
            title: "Token Printed Successfully",
            description: `Token: ${tokenNumber}`,
          });

          setIsPrinted((prev) => ({ ...prev, token: true }));
        };
      }, 500);
    };
  };

  const handlePrintInvoice = () => {
    if (!invoiceSectionRef.current) return;

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

    // Create the invoice content directly in the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .invoice-container {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 20px;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #ddd;
              padding-bottom: 15px;
              margin-bottom: 15px;
            }
            .company-info h1 {
              font-size: 24px;
              margin-bottom: 5px;
              margin-top: 0;
            }
            .company-info p {
              color: #666;
              margin: 3px 0;
              font-size: 14px;
            }
            .invoice-details {
              text-align: right;
            }
            .invoice-details p {
              margin: 3px 0;
              font-size: 14px;
            }
            .invoice-details label {
              font-weight: 500;
            }
            .patient-info {
              border-bottom: 1px solid #ddd;
              padding-bottom: 15px;
              margin-bottom: 15px;
            }
            .patient-info h2 {
              font-size: 18px;
              margin-bottom: 10px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            .info-item label {
              display: block;
              font-size: 14px;
              font-weight: 500;
              margin-bottom: 3px;
            }
            .info-item div {
              font-size: 14px;
            }
            .services h2 {
              font-size: 18px;
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              font-size: 14px;
            }
            td {
              font-size: 14px;
            }
            .amount {
              text-align: right;
            }
            .total {
              font-weight: bold;
            }
            .payment-info {
              margin-top: 20px;
            }
            .payment-info h2 {
              font-size: 18px;
              margin-bottom: 10px;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            @media print {
              body {
                padding: 0;
              }
            }
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
                  <tr>
                    <td>${
                      consultationTypes.find(
                        (type) => type.id === formData.consultationType
                      )?.label
                    }</td>
                    <td class="amount">$${formData.consultationFee}</td>
                  </tr>
                  <tr class="total">
                    <td class="amount">Total</td>
                    <td class="amount">$${formData.consultationFee}</td>
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

    // Modified this section to remove the print requirement check
    // if (!isPrinted.token || !isPrinted.invoice) {
    //   toast({
    //     title: "Error",
    //     description: "Please print both the token and invoice first",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    // Add token generation timestamp
    const tokenDate = new Date().toISOString();

    const tokenData = {
      ...formData,
      tokenNumber,
      invoiceNumber,
      tokenDate,
    };

    toast({
      title: "Token Generation Complete",
      description: `Token Number: ${tokenNumber}`,
    });

    // Pass the data to parent component
    onComplete(tokenData);
  };

  if (!patientData) return <div>Loading patient data...</div>;

  // Modified this line to remove the "bothPrinted" requirement
  // const bothPrinted = isPrinted.token && isPrinted.invoice;

  return (
    <>
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
                <Label htmlFor="consultationType">Consultation Type</Label>
                <Select
                  value={formData.consultationType}
                  onValueChange={handleConsultationTypeChange}
                >
                  <SelectTrigger id="consultationType">
                    <SelectValue placeholder="Select consultation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {consultationTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label} - ${type.fee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="consultationFee">Consultation Fee</Label>
                <Input
                  id="consultationFee"
                  value={`$${formData.consultationFee}`}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
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

              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrintToken}
                    disabled={!formData.paymentReceived}
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
                    disabled={!formData.paymentReceived}
                    className="flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Print Invoice
                    {isPrinted.invoice && (
                      <Check className="ml-1 h-4 w-4 text-green-600" />
                    )}
                  </Button>
                </div>

                {/* Modified this button to only be disabled if payment is not received */}
                <Button type="submit" disabled={!formData.paymentReceived}>
                  Complete Token Generation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Hidden sections - kept for reference but not used for printing anymore */}
      <div ref={tokenSectionRef} className="hidden"></div>
      <div ref={invoiceSectionRef} className="hidden"></div>
    </>
  );
}
