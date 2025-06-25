import { IAttendanceStats } from "@/types/Attendance";
import { ScrollView, Text, View } from "react-native";
import { Svg, Circle } from "react-native-svg";
import React from "react";

interface AttendanceStatsProps {
  attendancesStats: IAttendanceStats;
}

const SIZE = 60;
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const COLORS = {
  present: "#22c55e", // green
  absent: "#ef4444", // red
  background: "#020815",
  text: "#FFFFFF",
  subtext: "#7AC8F9",
};

const AttendanceStats = ({ attendancesStats }: AttendanceStatsProps) => {
    const generalPresentPercentage = (attendancesStats.reduce(
        (acc, statsItem) => acc + statsItem.present_percent,
        0
    ) / attendancesStats.length).toFixed(2);

  return (
  <View>
      <Text className="text-text text-center py-2 pb-4 text-xl">Całkowita frekwencja: <Text className="font-bold">{generalPresentPercentage}%</Text></Text>
    <ScrollView className="px-4 py-3 mb-[140px]">
      {attendancesStats.map((item) => {
        const percent = Math.min(item.present_percent, 100);
        const strokeDashoffset =
          CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

        return (
          <View
            key={item.subject}
            className="bg-background rounded-2xl p-4 px-6 mb-4 gap-2 shadow-md flex-row items-center justify-between"
          >
            <Svg width={SIZE} height={SIZE}>
              {/* Background circle */}
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={COLORS.absent}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={COLORS.present}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                rotation={-90}
                origin={`${SIZE / 2}, ${SIZE / 2}`}
              />
            </Svg>

            <View className="flex-1 ml-4">
              <Text className="text-text text-lg font-semibold">
                {item.subject}
              </Text>
              <Text className="text-subtext mt-1">
                Obecność: {item.present_percent.toFixed(1)}%
              </Text>
              <Text className="text-subtext text-sm">
                {item.present_count}/{item.total} obecności
              </Text>
              <Text className="text-subtext text-sm">
                {item.absent_count} nieobecności
              </Text>
              <Text className="text-subtext text-sm">
                {item.late_count} spóźnień
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  </View>
  );
};

export default AttendanceStats;
