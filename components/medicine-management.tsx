"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Plus, Pencil, Trash2, Search } from "lucide-react"

// Sample medicine data
const initialMedicines = [
  { id: 1, name: "Paracetamol", expiryDate: "2025-12-31", stockQuantity: 500, mg: 500, price: 5 },
  { id: 2, name: "Amoxicillin", expiryDate: "2025-10-15", stockQuantity: 300, mg: 250, price: 15 },
  { id: 3, name: "Omeprazole", expiryDate: "2025-08-20", stockQuantity: 200, mg: 20, price: 20 },
  { id: 4, name: "Ibuprofen", expiryDate: "2025-11-30", stockQuantity: 400, mg: 400, price: 8 },
  { id: 5, name: "Cetirizine", expiryDate: "2025-09-25", stockQuantity: 350, mg: 10, price: 12 },
  { id: 6, name: "Aspirin", expiryDate: "2025-07-15", stockQuantity: 600, mg: 75, price: 6 },
  { id: 7, name: "Metformin", expiryDate: "2025-06-30", stockQuantity: 250, mg: 500, price: 18 },
  { id: 8, name: "Atorvastatin", expiryDate: "2025-05-20", stockQuantity: 180, mg: 20, price: 25 },
  { id: 9, name: "Lisinopril", expiryDate: "2025-04-15", stockQuantity: 220, mg: 10, price: 22 },
  { id: 10, name: "Amlodipine", expiryDate: "2025-03-10", stockQuantity: 270, mg: 5, price: 20 },
]

// Update the medicine management component to expose medicines to other components
// Add this at the top of the file, after the initialMedicines array

// Create a singleton to share medicine data across components
export const MedicineInventory = {
  _medicines: initialMedicines,
  getMedicines: function () {
    return this._medicines
  },
  updateMedicines: function (newMedicines) {
    this._medicines = newMedicines
  },
}

export function MedicineManagement() {
  const [medicines, setMedicines] = useState(MedicineInventory.getMedicines())
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentMedicine, setCurrentMedicine] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    expiryDate: "",
    stockQuantity: "",
    mg: "",
    price: "",
  })

  // Filter medicines based on search term
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddMedicine = () => {
    // Validate form data
    if (!formData.name || !formData.expiryDate || !formData.stockQuantity || !formData.mg || !formData.price) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    // Create new medicine
    const newMedicine = {
      id: medicines.length > 0 ? Math.max(...medicines.map((m) => m.id)) + 1 : 1,
      name: formData.name,
      expiryDate: formData.expiryDate,
      stockQuantity: Number.parseInt(formData.stockQuantity),
      mg: Number.parseInt(formData.mg),
      price: Number.parseFloat(formData.price),
    }

    // Add to medicines list
    const updatedMedicines = [...medicines, newMedicine]
    setMedicines(updatedMedicines)
    MedicineInventory.updateMedicines(updatedMedicines)

    // Reset form and close dialog
    setFormData({
      name: "",
      expiryDate: "",
      stockQuantity: "",
      mg: "",
      price: "",
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: "Medicine added successfully",
    })
  }

  const handleEditClick = (medicine) => {
    setCurrentMedicine(medicine)
    setFormData({
      name: medicine.name,
      expiryDate: medicine.expiryDate,
      stockQuantity: medicine.stockQuantity.toString(),
      mg: medicine.mg.toString(),
      price: medicine.price.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleEditMedicine = () => {
    // Validate form data
    if (!formData.name || !formData.expiryDate || !formData.stockQuantity || !formData.mg || !formData.price) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    // Update medicine
    const updatedMedicines = medicines.map((medicine) =>
      medicine.id === currentMedicine.id
        ? {
            ...medicine,
            name: formData.name,
            expiryDate: formData.expiryDate,
            stockQuantity: Number.parseInt(formData.stockQuantity),
            mg: Number.parseInt(formData.mg),
            price: Number.parseFloat(formData.price),
          }
        : medicine,
    )

    setMedicines(updatedMedicines)
    MedicineInventory.updateMedicines(updatedMedicines)

    // Reset form and close dialog
    setFormData({
      name: "",
      expiryDate: "",
      stockQuantity: "",
      mg: "",
      price: "",
    })
    setCurrentMedicine(null)
    setIsEditDialogOpen(false)

    toast({
      title: "Success",
      description: "Medicine updated successfully",
    })
  }

  const handleDeleteClick = (medicine) => {
    setCurrentMedicine(medicine)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteMedicine = () => {
    // Delete medicine
    const updatedMedicines = medicines.filter((medicine) => medicine.id !== currentMedicine.id)
    setMedicines(updatedMedicines)
    MedicineInventory.updateMedicines(updatedMedicines)

    // Reset and close dialog
    setCurrentMedicine(null)
    setIsDeleteDialogOpen(false)

    toast({
      title: "Success",
      description: "Medicine deleted successfully",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search medicines..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medicine</DialogTitle>
              <DialogDescription>Enter the details of the new medicine to add to inventory.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Medicine Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter medicine name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mg">Dosage (mg)</Label>
                  <Input
                    id="mg"
                    name="mg"
                    type="number"
                    value={formData.mg}
                    onChange={handleInputChange}
                    placeholder="Enter mg"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMedicine}>Add Medicine</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Dosage (mg)</TableHead>
              <TableHead>Price ($)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell className="font-medium">{medicine.name}</TableCell>
                  <TableCell>{medicine.expiryDate}</TableCell>
                  <TableCell>{medicine.stockQuantity}</TableCell>
                  <TableCell>{medicine.mg} mg</TableCell>
                  <TableCell>${medicine.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(medicine)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(medicine)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No medicines found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Medicine Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Medicine</DialogTitle>
            <DialogDescription>Update the details of the selected medicine.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Medicine Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-expiryDate">Expiry Date</Label>
              <Input
                id="edit-expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-stockQuantity">Stock Quantity</Label>
                <Input
                  id="edit-stockQuantity"
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-mg">Dosage (mg)</Label>
                <Input id="edit-mg" name="mg" type="number" value={formData.mg} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMedicine}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Medicine Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Medicine</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this medicine? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentMedicine && (
            <div className="py-4">
              <p>
                <strong>Name:</strong> {currentMedicine.name}
              </p>
              <p>
                <strong>Dosage:</strong> {currentMedicine.mg} mg
              </p>
              <p>
                <strong>Stock:</strong> {currentMedicine.stockQuantity} units
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMedicine}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

