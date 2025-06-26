import React, { useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import Stats from "./stats";
import Day from "./day";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"stats" | "day">("stats");

  return (
    <SafeAreaView className="flex-1 bg-background py-0">
      <View className="flex flex-row justify-between px-5 py-3 pt-12 bg-background">
        <Text className="text-2xl text-white font-semibold">Attendances</Text>
      </View>

      <View className="flex flex-row justify-around bg-background  py-4">
          <TouchableOpacity onPress={() => setActiveTab("day")}>
          <Text
            className={`text-lg font-semibold ${
              activeTab === "day" ? "text-accent" : "text-subtext"
            }`}
          >
            Przegląd dzienny
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("stats")}>
          <Text
            className={`text-lg font-semibold ${
              activeTab === "stats" ? "text-accent" : "text-subtext"
            }`}
          >
            Statystyki
          </Text>
        </TouchableOpacity>


      </View>

      {/* Treść */}
      <View className="flex-1">
        {activeTab === "stats" ? <Stats /> : <Day />}
      </View>
    </SafeAreaView>
  );
};

export default Index;
