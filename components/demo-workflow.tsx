import { ArrowRight } from "lucide-react"

export function DemoWorkflow() {
  return (
    <div className="flex flex-col space-y-8 p-4">
      <div className="flex flex-col items-center space-y-2">
        <div className="flex h-12 w-full max-w-md items-center justify-center rounded-md bg-primary text-primary-foreground">
          1. Patient Registration
        </div>
        <p className="text-sm text-muted-foreground">Patient details are recorded and unique ID generated</p>
      </div>

      <div className="flex justify-center">
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex h-12 w-full max-w-md items-center justify-center rounded-md bg-primary text-primary-foreground">
          2. Doctor Consultation
        </div>
        <p className="text-sm text-muted-foreground">Doctor examines patient and provides recommendations</p>
      </div>

      <div className="flex justify-center">
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex h-12 w-full max-w-md items-center justify-center rounded-md bg-primary text-primary-foreground">
          3. Laboratory (if required)
        </div>
        <p className="text-sm text-muted-foreground">Lab tests are conducted and results recorded</p>
      </div>

      <div className="flex justify-center">
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex h-12 w-full max-w-md items-center justify-center rounded-md bg-primary text-primary-foreground">
          4. Doctor Reviews Test Results
        </div>
        <p className="text-sm text-muted-foreground">Doctor analyzes results and provides prescription</p>
      </div>

      <div className="flex justify-center">
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex h-12 w-full max-w-md items-center justify-center rounded-md bg-primary text-primary-foreground">
          5. Pharmacy & Medicine Purchase
        </div>
        <p className="text-sm text-muted-foreground">Medicine bills generated and inventory updated</p>
      </div>

      <div className="flex justify-center">
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex h-12 w-full max-w-md items-center justify-center rounded-md bg-primary text-primary-foreground">
          6. Patient Leaves with Records Updated
        </div>
        <p className="text-sm text-muted-foreground">All patient data is saved in the system</p>
      </div>
    </div>
  )
}

