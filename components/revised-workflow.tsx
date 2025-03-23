import { ArrowRight } from "lucide-react"

export function RevisedWorkflow() {
  return (
    <div className="flex flex-col space-y-8 p-4">
      <div className="flex flex-col items-center space-y-2">
        <div className="flex h-12 w-full max-w-md items-center justify-center rounded-md bg-primary text-primary-foreground">
          1. Patient Registration & Token Generation
        </div>
        <p className="text-sm text-muted-foreground">Patient pays for consultation, receives token and invoice</p>
      </div>

      <div className="flex justify-center">
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex h-12 w-full max-w-md items-center justify-center rounded-md bg-primary text-primary-foreground">
          2. Doctor Consultation (Manual Process)
        </div>
        <p className="text-sm text-muted-foreground">
          Doctor examines patient and writes test recommendations on paper
        </p>
      </div>

      <div className="flex justify-center">
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex h-12 w-full max-w-md items-center justify-center rounded-md bg-primary text-primary-foreground">
          3. Laboratory Test Billing
        </div>
        <p className="text-sm text-muted-foreground">Patient pays for recommended tests, receives token and invoice</p>
      </div>

      <div className="flex justify-center">
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex h-12 w-full max-w-md items-center justify-center rounded-md bg-primary text-primary-foreground">
          4. Test Results Entry & Printing
        </div>
        <p className="text-sm text-muted-foreground">Lab technician enters test results and prints report</p>
      </div>

      <div className="flex justify-center">
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex h-12 w-full max-w-md items-center justify-center rounded-md bg-primary text-primary-foreground">
          5. Doctor Reviews Results (Manual Process)
        </div>
        <p className="text-sm text-muted-foreground">Doctor reviews printed results and writes prescription</p>
      </div>

      <div className="flex justify-center">
        <ArrowRight className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex h-12 w-full max-w-md items-center justify-center rounded-md bg-primary text-primary-foreground">
          6. Pharmacy & Medicine Purchase
        </div>
        <p className="text-sm text-muted-foreground">Patient pays for medicine based on handwritten prescription</p>
      </div>
    </div>
  )
}

