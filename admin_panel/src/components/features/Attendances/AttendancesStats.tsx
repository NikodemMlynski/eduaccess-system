import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import {IAttendanceStatsItem} from "@/types/Attendance.ts";

export type IAttendanceStats = IAttendanceStatsItem[];

interface Props {
  data: IAttendanceStats;
}
const COLORS = ["#22c55e", "#ef4444"];
const AttendanceStatsGrid: React.FC<Props> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {data.map((item) => {
        const chartDataRaw = [
          { name: "Obecności", value: item.present_count },
          { name: "Nieobecności", value: item.absent_count },
        ];

        const isAllZero = chartDataRaw.every((entry) => entry.value === 0);
        const chartData = isAllZero
          ? [{ name: "Brak danych", value: 1 }]
          : chartDataRaw;

        const chartColors = isAllZero ? ["#ef4444"] : COLORS;

        return (
          <Card key={item.subject} className="shadow-md flex flex-row justify-around gap-1 pr-10">
            <CardContent className="flex flex-col gap-0">
              <div className="flex flex-col items-center gap-0">
                <PieChart width={130} height={130}>
                  <Pie
                    data={chartData}
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={chartColors[idx]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </CardContent>
               <div className="flex flex-col">
                  <CardHeader>
                      <CardTitle className="text-center text-xl pt-2">{item.subject}</CardTitle>
                  </CardHeader>
                   <p className="mt-2 text-md font-medium">
                  Obecność: {item.present_percent.toFixed(2)}%
                </p>
                  <p className="text-sm text-muted-foreground">{item.present_count}/{item.total} obecności</p>
                  <p className="text-sm text-muted-foreground">{item.absent_count} nieobecności</p>
                  <p className="text-sm text-muted-foreground">{item.late_count} spóźnień</p>
              </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AttendanceStatsGrid;