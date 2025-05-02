"use client";

import { useClasses, useClassesByYear, useCreateClass } from "@/hooks/classes";
import { useAuth } from "@/context/AuthProvider";
import { Loader2, Plus } from "lucide-react";
import Classes from "@/components/features/Classes/Classes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

const CLASS_YEARS = [1, 2, 3, 4, 5];

export default function ClassesPage() {
  const { user, token } = useAuth();
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");

  const {
    data: allClasses,
    isLoading: loadingAll,
    isError: errorAll,
  } = useClasses(`school/${user?.school_id}/classes`, token || "", {
    enabled: selectedYear === "all",
  });

  const {
    data: yearClasses,
    isLoading: loadingYear,
    isError: errorYear,
  } = useClassesByYear(`school/${user?.school_id}/classes`, selectedYear as number, token || "", {
    enabled: selectedYear !== "all",
  });

  const createClass = useCreateClass(user?.school_id, token || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!className) return;

    createClass.mutate(
      { class_name: className },
      {
        onSuccess: () => {
          setOpen(false);
          setClassName("");
          toast.success("Klasa została dodana!");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const isLoading = selectedYear === "all" ? loadingAll : loadingYear;
  const isError = selectedYear === "all" ? errorAll : errorYear;
  const data = selectedYear === "all" ? allClasses : yearClasses;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Classes list</h1>

      {/* 🔘 Filtry + Dodawanie */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedYear === "all" ? "default" : "outline"}
            onClick={() => setSelectedYear("all")}
          >
            All classes
          </Button>
          {CLASS_YEARS.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              onClick={() => setSelectedYear(year)}
            >
              Classes {year}
            </Button>
          ))}
        </div>

        {/* ➕ Dodaj klasę */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" size="sm">
              <Plus className="w-4 h-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new class</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="class_name">Class name</Label>
                <Input
                  id="class_name"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="np. 3A"
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={createClass.isPending || !className}
                >
                  {createClass.isPending ? "Adding..." : "Add class"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🌀 Loader */}
      {isLoading && (
        <div className="flex items-center justify-center h-[40vh]">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      )}

      {isError && (
        <div className="text-center text-red-500 mt-10">
          Error with loading class.
        </div>
      )}

      {!isLoading && !isError && <Classes schoolClasses={data || []} />}
    </div>
  );
}
