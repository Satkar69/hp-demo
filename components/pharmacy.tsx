"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Printer, Check, Search } from "lucide-react";

// Update to use the shared MedicineInventory
import { MedicineInventory } from "@/components/medicine-management";

// Import the initial medicines data from the medicine management component
const initialMedicines = [
  {
    id: 1,
    name: "Paracetamol",
    expiryDate: "2025-12-31",
    stockQuantity: 500,
    mg: 500,
    price: 5,
  },
  {
    id: 2,
    name: "Amoxicillin",
    expiryDate: "2025-10-15",
    stockQuantity: 300,
    mg: 250,
    price: 15,
  },
  {
    id: 3,
    name: "Omeprazole",
    expiryDate: "2025-08-20",
    stockQuantity: 200,
    mg: 20,
    price: 20,
  },
  {
    id: 4,
    name: "Ibuprofen",
    expiryDate: "2025-11-30",
    stockQuantity: 400,
    mg: 400,
    price: 8,
  },
  {
    id: 5,
    name: "Cetirizine",
    expiryDate: "2025-09-25",
    stockQuantity: 350,
    mg: 10,
    price: 12,
  },
];

export function Pharmacy({ patientData, onComplete }) {
  const [formData, setFormData] = useState({
    patientId: "",
    handwrittenPrescription: "",
    paymentMethod: "cash",
    paymentReceived: false,
    receiptNumber: "",
    notes: "",
  });

  // Update the useState for medicines
  const [medicines, setMedicines] = useState(() => {
    // Get medicines from the shared inventory
    return MedicineInventory.getMedicines().map((med) => ({
      ...med,
      quantity: 0,
    }));
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isPrinted, setIsPrinted] = useState(false);

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

  const handleQuantityChange = (index, value) => {
    const newQuantity = Number.parseInt(value) || 0;
    setMedicines((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: newQuantity };
      return updated;
    });
  };

  const handlePriceChange = (index, value) => {
    const newPrice = Number.parseFloat(value) || 0;
    setMedicines((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], price: newPrice };
      return updated;
    });
  };

  // Update the print functionality
  const handlePrintReceipt = () => {
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
          <title>Medicine Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            .receipt-container { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { font-size: 24px; margin-bottom: 5px; }
            .header p { color: #666; margin-top: 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
            .info-item label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { font-size: 14px; }
            td { font-size: 14px; }
            .amount { text-align: right; }
            .total { font-weight: bold; }
            .footer { text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <h1>MEDICINE RECEIPT</h1>
              <p>City Hospital Pharmacy</p>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <label>Patient ID:</label>
                <div>${formData.patientId}</div>
              </div>
              <div class="info-item">
                <label>Receipt Number:</label>
                <div>${formData.receiptNumber}</div>
              </div>
              <div class="info-item">
                <label>Date & Time:</label>
                <div>${formattedDate} ${formattedTime}</div>
              </div>
              <div class="info-item">
                <label>Payment Method:</label>
                <div>${formData.paymentMethod}</div>
              </div>
            </div>
            <div class="medicines">
              <h4>Medicines Purchased:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th class="amount">Quantity</th>
                    <th class="amount">Unit Price</th>
                    <th class="amount">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${medicines
                    .filter((med) => med.quantity > 0)
                    .map(
                      (medicine) => `
                    <tr>
                      <td>${medicine.name} (${medicine.mg} mg)</td>
                      <td class="amount">${medicine.quantity}</td>
                      <td class="amount">$${medicine.price.toFixed(2)}</td>
                      <td class="amount">$${(
                        medicine.price * medicine.quantity
                      ).toFixed(2)}</td>
                    </tr>
                  `
                    )
                    .join("")}
                  <tr class="total">
                    <td colspan="3" class="amount">Total:</td>
                    <td class="amount">$${totalBill.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="footer">
              <p>Thank you for choosing City Hospital Pharmacy</p>
              <p>Get well soon!</p>
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
            title: "Receipt Printed Successfully",
            description: "Medicine receipt has been printed",
          });

          setIsPrinted(true);
        };
      }, 500);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate total bill
    const selectedMedicines = medicines.filter((med) => med.quantity > 0);
    const totalBill = selectedMedicines.reduce(
      (sum, med) => sum + med.price * med.quantity,
      0
    );

    // Update the medicine inventory
    const updatedInventory = MedicineInventory.getMedicines().map(
      (inventoryMed) => {
        const soldMed = selectedMedicines.find(
          (med) => med.id === inventoryMed.id
        );
        if (soldMed) {
          return {
            ...inventoryMed,
            stockQuantity: inventoryMed.stockQuantity - soldMed.quantity,
          };
        }
        return inventoryMed;
      }
    );

    // Update the shared inventory
    MedicineInventory.updateMedicines(updatedInventory);

    // Reset quantities after purchase
    setMedicines((prev) => prev.map((med) => ({ ...med, quantity: 0 })));

    // Add pharmacy timestamp
    const pharmacyDate = new Date().toISOString();

    const pharmacyData = {
      ...formData,
      medicines: selectedMedicines,
      totalBill,
      pharmacyDate,
    };

    toast({
      title: "Medicine Purchase Complete",
      description: `Total bill: $${totalBill.toFixed(2)}. Receipt #${
        formData.receiptNumber
      }`,
    });

    // Pass the data to parent component
    onComplete(pharmacyData);
  };

  // If we have patient data, use it
  if (patientData) {
    // Pre-fill patient ID if available
    if (formData.patientId === "" && patientData.patientId) {
      setFormData((prev) => ({ ...prev, patientId: patientData.patientId }));
    }
  }

  const totalBill = medicines.reduce(
    (sum, med) => sum + med.price * med.quantity,
    0
  );

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                name="patientId"
                placeholder="Enter patient ID from prescription"
                value={formData.patientId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="handwrittenPrescription">
                Handwritten Prescription Details
              </Label>
              <Textarea
                id="handwrittenPrescription"
                name="handwrittenPrescription"
                placeholder="Enter details from the doctor's handwritten prescription"
                value={formData.handwrittenPrescription}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label>Medicines</Label>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search medicines..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="space-y-4">
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((medicine, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <Label>
                            {medicine.name} ({medicine.mg} mg)
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Stock: {medicine.stockQuantity} | Expires:{" "}
                            {medicine.expiryDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20">
                            <Input
                              type="number"
                              min="0"
                              max={medicine.stockQuantity}
                              value={medicine.quantity}
                              onChange={(e) =>
                                handleQuantityChange(index, e.target.value)
                              }
                              placeholder="Qty"
                            />
                          </div>
                          <div className="w-20">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={medicine.price}
                              onChange={(e) =>
                                handlePriceChange(index, e.target.value)
                              }
                              placeholder="Price"
                            />
                          </div>
                          <div className="w-20 text-right">
                            ${(medicine.price * medicine.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">
                      No medicines found. Try a different search term.
                    </p>
                  )}
                  <div className="flex items-center justify-between border-t pt-4 font-medium">
                    <span>Total:</span>
                    <span>${totalBill.toFixed(2)}</span>
                  </div>
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
                onClick={handlePrintReceipt}
                disabled={!formData.paymentReceived || totalBill === 0}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Receipt
              </Button>

              {isPrinted && (
                <div className="flex items-center text-sm text-green-600">
                  <Check className="mr-1 h-4 w-4" />
                  Printed Successfully
                </div>
              )}

              <Button
                type="submit"
                disabled={!formData.paymentReceived || totalBill === 0} // Removed !isPrinted check
              >
                Complete Medicine Purchase
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
