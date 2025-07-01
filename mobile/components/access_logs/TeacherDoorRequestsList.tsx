import React from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { IAccessLog, accessStatus } from "@/types/AccessLogs";
import TeacherDoorRequestItem from "@/components/access_logs/TeacherDoorRequestItem"


interface TeacherDoorRequestsListProps {
  accessLogs: IAccessLog[];
  teacherId: number;
}

const TeacherDoorRequestsList = ({
     accessLogs,
    teacherId,
}: TeacherDoorRequestsListProps) => {


  return (
    <ScrollView className="px-7 py-4 mb-[220px]">
      {accessLogs.map((accessLog) => (
        <TeacherDoorRequestItem teacherId={teacherId} accessLog={accessLog} key={accessLog.id} />
      ))}
    </ScrollView>
  );
};

export default TeacherDoorRequestsList;
