import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import {weekdays as weekdaysArr} from "@/utils/weekdays"
interface Props {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const LessonInstanceDatePickerMobile = ({ selectedDate, setSelectedDate }: Props) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(selectedDate, { weekStartsOn: 1 }));

  const weekdays = Array.from({ length: 5 }, (_, i) => addDays(currentWeekStart, i));

  const changeWeek = (direction: "prev" | "next") => {
    const newStart = addDays(currentWeekStart, direction === "next" ? 7 : -7);
    setCurrentWeekStart(newStart);
  };

  return (
    <View className="flex flex-row justify-between items-center px-4 py-2">
      <TouchableOpacity onPress={() => changeWeek("prev")}>
        <ArrowLeft color="white" />
      </TouchableOpacity>

      {weekdays.map((day, idx) => {
        const isSelected = isSameDay(day, selectedDate);
        const today = isToday(day);

        return (
          <TouchableOpacity
            key={idx}
            className={`w-12 h-12 rounded-full mx-1 items-center justify-center
              ${isSelected ? "bg-surface" : today ? "bg-[#444]" : "bg-[#222]"}
            `}
            onPress={() => setSelectedDate(day)}
          >
            <Text className={`text-sm ${isSelected || today ? "text-white" : "text-gray-400"}`}>
              {format(day, "d")}
            </Text>
                <Text className={`text-sm ${isSelected || today ? "text-white" : "text-gray-400"}`}>
                    {weekdaysArr[idx].shortName}
                </Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity onPress={() => changeWeek("next")}>
        <ArrowRight color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default LessonInstanceDatePickerMobile;
