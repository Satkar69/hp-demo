import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Activity,
  UserPlus,
  Ticket,
  FlaskRoundIcon as Flask,
  ClipboardList,
  Pill,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Hospital Management System
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A comprehensive solution for managing hospital workflows
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="bg-primary/5">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Super Admin Portal</CardTitle>
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <CardDescription>Advanced management and reporting</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Manage medicine inventory, generate reports, and oversee system
              operations.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/super-admin" className="w-full">
              <Button className="w-full" variant="outline">
                Access Super Admin <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <Link href="/dashboard">
          <Button size="lg">
            Enter Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
