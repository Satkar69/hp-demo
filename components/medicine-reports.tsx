"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, Printer } from "lucide-react";

// Updated sample data for medicine sales report
const medicineSalesData = [
  {
    name: "Jan",
    sales: 4000,
    volume: 800, // Number of medicines sold
    stock: 4200, // Remaining stock
  },
  {
    name: "Feb",
    sales: 3000,
    volume: 600,
    stock: 3600,
  },
  {
    name: "Mar",
    sales: 2000,
    volume: 400,
    stock: 3200,
  },
  {
    name: "Apr",
    sales: 2780,
    volume: 556,
    stock: 2644,
  },
  {
    name: "May",
    sales: 1890,
    volume: 378,
    stock: 2266,
  },
  {
    name: "Jun",
    sales: 2390,
    volume: 478,
    stock: 1788,
  },
  {
    name: "Jul",
    sales: 3490,
    volume: 698,
    stock: 1090,
  },
  {
    name: "Aug",
    sales: 4000,
    volume: 800,
    stock: 290,
  },
  {
    name: "Sep",
    sales: 3200,
    volume: 640,
    stock: -350, // Negative stock indicates over-selling
  },
  {
    name: "Oct",
    sales: 2800,
    volume: 560,
    stock: -910,
  },
  {
    name: "Nov",
    sales: 3300,
    volume: 660,
    stock: -1570,
  },
  {
    name: "Dec",
    sales: 3500,
    volume: 700,
    stock: -2270,
  },
];

// Sample data for patient visits report
const patientVisitsData = [
  { name: "Jan", visits: 240 },
  { name: "Feb", visits: 210 },
  { name: "Mar", visits: 180 },
  { name: "Apr", visits: 200 },
  { name: "May", visits: 190 },
  { name: "Jun", visits: 220 },
  { name: "Jul", visits: 250 },
  { name: "Aug", visits: 280 },
  { name: "Sep", visits: 260 },
  { name: "Oct", visits: 230 },
  { name: "Nov", visits: 240 },
  { name: "Dec", visits: 270 },
];

// Sample data for top selling medicines
const topSellingMedicinesData = [
  { name: "Paracetamol", value: 400 },
  { name: "Amoxicillin", value: 300 },
  { name: "Omeprazole", value: 300 },
  { name: "Ibuprofen", value: 200 },
  { name: "Cetirizine", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function MedicineReports() {
  const [reportType, setReportType] = useState("monthly");
  const [reportYear, setReportYear] = useState("2023");
  const [reportMonth, setReportMonth] = useState("all");
  const [activeTab, setActiveTab] = useState("");

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: `${
        reportType.charAt(0).toUpperCase() + reportType.slice(1)
      } report for ${
        reportMonth === "all" ? "all months" : reportMonth
      } ${reportYear} has been generated.`,
    });
  };

  const handlePrintReport = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (!printWindow) {
      toast({
        title: "Print Error",
        description: "Popup blocked. Please allow popups for this site.",
        variant: "destructive",
      });
      return;
    }

    let reportTitle;
    // Get data based on active tab
    if (activeTab === "medicine-sales") {
      reportTitle = "Medicine Sales Report";
    } else if (activeTab === "patient-visits") {
      reportTitle = "Patient Visits Report";
    }

    // Generate HTML content
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportTitle} - ${reportYear}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; margin-bottom: 5px; }
          p.subtitle { color: #666; margin-top: 0; margin-bottom: 20px; }
          .report-card { border: 1px solid #ddd; border-radius: 8px; margin-bottom: 30px; padding: 20px; }
          h2 { color: #444; margin-top: 0; }
          p.desc { color: #666; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f8f8; }
          .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px; }
          .summary-item { background-color: #f8f8f8; padding: 15px; border-radius: 6px; }
          .summary-label { margin: 0; color: #666; font-size: 14px; }
          .summary-value { margin: 5px 0 0 0; font-size: 24px; font-weight: bold; }
          .growth { color: #22c55e; }
          .insights { background-color: #f8f8f8; padding: 15px; border-radius: 6px; margin-top: 20px; }
          .insights h3 { margin-top: 0; }
          .insights ul { margin-bottom: 0; }
          .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>${reportTitle} - ${reportYear}</h1>
        <p class="subtitle">Generated on ${new Date().toLocaleDateString()}</p>
    `;

    if (activeTab === "medicine-sales") {
      // Medicine Sales Report HTML
      htmlContent += `
        <div class="report-card">
          <h2>Monthly Sales Data</h2>
          <p class="desc">Monthly breakdown of medicine sales for ${reportYear}</p>
          
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Sales ($)</th>
                <th>Volume (Units)</th>
                <th>Remaining Stock</th>
              </tr>
            </thead>
            <tbody>
              ${medicineSalesData
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>$${item.sales.toLocaleString()}</td>
                  <td>${item.volume}</td>
                  <td>${item.stock}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    } else if (activeTab === "patient-visits") {
      // Patient Visits Report HTML
      htmlContent += `
        <div class="report-card">
          <h2>Monthly Patient Visits</h2>
          <p class="desc">Monthly breakdown of patient visits for ${reportYear}</p>
          
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Visits</th>
              </tr>
            </thead>
            <tbody>
              ${patientVisitsData
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.visits}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
        
        <div class="report-card">
          <h2>Patient Visits Summary</h2>
          <p class="desc">Key metrics for patient visits</p>
          
          <div class="summary-grid">
            <div class="summary-item">
              <p class="summary-label">Total Visits</p>
              <p class="summary-value">2,670</p>
            </div>
            <div class="summary-item">
              <p class="summary-label">New Patients</p>
              <p class="summary-value">845</p>
            </div>
            <div class="summary-item">
              <p class="summary-label">Return Visits</p>
              <p class="summary-value">1,825</p>
            </div>
          </div>
        </div>
      `;
    }

    // Add footer and close HTML
    htmlContent += `
        <div class="footer">
          © ${new Date().getFullYear()} Your Pharmacy Management System
        </div>
      </body>
      </html>
    `;

    // Write to the new window
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load
    printWindow.onload = function () {
      // Focus and print
      printWindow.focus();
      printWindow.print();

      // Close the window after printing
      setTimeout(() => {
        printWindow.close();
      }, 500);
    };

    toast({
      title: "Printing Report",
      description: `${reportTitle} for ${reportYear} sent to printer.`,
    });
  };
  const handleDownloadReport = () => {
    toast({
      title: "Downloading Report",
      description: "Report is being downloaded as PDF.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-2">
          <h2 className="text-xl font-bold">Generate Reports</h2>
          <p className="text-sm text-muted-foreground">
            Generate monthly and annual reports for medicine sales and patient
            visits.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handlePrintReport}
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleDownloadReport}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Type</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly Report</SelectItem>
              <SelectItem value="annual">Annual Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Year</label>
          <Select value={reportYear} onValueChange={setReportYear}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {reportType === "monthly" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Month</label>
            <Select value={reportMonth} onValueChange={setReportMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                <SelectItem value="January">January</SelectItem>
                <SelectItem value="February">February</SelectItem>
                <SelectItem value="March">March</SelectItem>
                <SelectItem value="April">April</SelectItem>
                <SelectItem value="May">May</SelectItem>
                <SelectItem value="June">June</SelectItem>
                <SelectItem value="July">July</SelectItem>
                <SelectItem value="August">August</SelectItem>
                <SelectItem value="September">September</SelectItem>
                <SelectItem value="October">October</SelectItem>
                <SelectItem value="November">November</SelectItem>
                <SelectItem value="December">December</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Button onClick={handleGenerateReport}>Generate Report</Button>

      <Tabs defaultValue="medicine-sales">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="medicine-sales"
            onClick={() => setActiveTab("medicine-sales")}
          >
            Medicine Sales
          </TabsTrigger>
          <TabsTrigger
            value="patient-visits"
            onClick={() => setActiveTab("patient-visits")}
          >
            Patient Visits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medicine-sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medicine Sales Report - {reportYear}</CardTitle>
              <CardDescription>
                Monthly breakdown of medicine sales for the selected year.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simple Table for Medicine Sales */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales ($)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Volume (Units)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remaining Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {medicineSalesData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${item.sales.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.volume}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            item.stock < 0 ? "text-red-600" : "text-gray-900"
                          }`}
                        >
                          {item.stock}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Sales Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Summary</CardTitle>
              <CardDescription>Key metrics for medicine sales.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">$42,395</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Total Units Sold
                  </p>
                  <p className="text-2xl font-bold">8,721</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Remaining Stock
                  </p>
                  <p className="text-2xl font-bold">2,270</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patient-visits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Visits Report - {reportYear}</CardTitle>
              <CardDescription>
                Monthly breakdown of patient visits for the selected year.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={patientVisitsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="visits"
                      name="Patient Visits"
                      fill="#82ca9d"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patient Visits Summary</CardTitle>
              <CardDescription>Key metrics for patient visits.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Visits</p>
                  <p className="text-2xl font-bold">2,670</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">New Patients</p>
                  <p className="text-2xl font-bold">845</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Return Visits</p>
                  <p className="text-2xl font-bold">1,825</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
