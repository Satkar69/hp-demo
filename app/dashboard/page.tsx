import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Users,
  BarChart3,
  UserPlus,
  Ticket,
  FlaskRoundIcon as Flask,
  ClipboardList,
  Pill,
  ShieldCheck,
} from "lucide-react";
import { RevisedWorkflow } from "@/components/revised-workflow";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="ml-auto flex gap-2">
            <Link href="/dashboard/demo">
              <Button variant="outline">Start Demo Workflow</Button>
            </Link>
            <Link href="/dashboard/super-admin">
              <Button variant="outline" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Super Admin
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
