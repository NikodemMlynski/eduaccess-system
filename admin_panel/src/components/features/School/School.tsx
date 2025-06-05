import { ISchool } from "@/types/School.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

interface SchoolProps {
  school?: ISchool;
}

export default function School({ school }: SchoolProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!school) {
    return (
      <div className="text-center text-muted-foreground text-sm mt-10">
        Brak danych szkoły do wyświetlenia.
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto mt-10 shadow-md bg-background text-foreground">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{school.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Adres szkoły:</p>
          <p className="text-base">{school.address}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Kod do dodawania uczniów:</p>
          <div className="flex items-center gap-2">
            <Input
              value={school.student_addition_code}
              readOnly
              className="text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={() =>
                handleCopy(school.student_addition_code, "student")
              }
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          {copied === "student" && (
            <p className="text-xs text-green-500">Skopiowano kod ucznia!</p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Kod do dodawania nauczycieli:</p>
          <div className="flex items-center gap-2">
            <Input
              value={school.teacher_addition_code}
              readOnly
              className="text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={() =>
                handleCopy(school.teacher_addition_code, "teacher")
              }
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          {copied === "teacher" && (
            <p className="text-xs text-green-500">Skopiowano kod nauczyciela!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
