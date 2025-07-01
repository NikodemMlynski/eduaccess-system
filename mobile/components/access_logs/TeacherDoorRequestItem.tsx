import { IAccessLog, accessStatus } from "@/types/AccessLogs";
import {Pressable, Text, View} from "react-native";
import {format} from "date-fns";
import React from "react";
import {useAuth} from "@/context/AuthContext";
import {useAccessLogApproval} from "@/hooks/access_logs";
import {Toast} from "toastify-react-native";

interface TeacherDoorRequestItemProps {
    accessLog: IAccessLog;
    teacherId: number;
}

const TeacherDoorRequestItem = ({
    accessLog,
    teacherId,
}: TeacherDoorRequestItemProps) => {
    const {user, token} = useAuth();
    const approveAccessLogMutation = useAccessLogApproval(
        `school/${user?.school_id}/access-logs`,
        accessLog.id,
        teacherId,
        token || ""
    )
    const handleReviewAccessLog = (status: accessStatus) => {
        approveAccessLogMutation.mutate({
            status,
            user_id: user?.id || null,
            current_time: "2025-06-16T09:20:52.681559"
        }, {
            onSuccess: async () => {
                Toast.success("Successfully approved access log");
            },
            onError: async () => {
                Toast.error("Error while reviewing access log");
            }
        })
    };
    return (
        <View
          key={accessLog.id}
          className="bg-surface rounded-2xl p-6 mb-4 shadow-md"
        >
            <Text className="text-white font-bold text-xl px-1">
                {accessLog.user.first_name} {accessLog.user.last_name}
            </Text>
            <Text className="text-subtext mt-1 text-lg">
                Room: {accessLog.room.room_name}
            </Text>
            <Text className="text-subtext text-lg">
                Start: {format(new Date(accessLog.access_start_time), "Pp")}
            </Text>
            <Text className="italic text-subtext mt-1 text-lg">
                Reason: {accessLog.reason}
            </Text>

            <View className="flex-row justify-end gap-5 mt-4 space-x-2">
                <Pressable
                  className="bg-green-500 px-5 py-3 rounded-xl"
                  onPress={() => handleReviewAccessLog("granted")}
                >
                  <Text className="text-white font-semibold text-xl">Grant</Text>
                </Pressable>
                <Pressable
                  className="bg-red-600 px-5 py-3 rounded-xl"
                  onPress={() => handleReviewAccessLog("denied")}
                >
                  <Text className="text-white font-semibold text-xl">Deny</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default TeacherDoorRequestItem;