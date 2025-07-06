import React, {useEffect, useState} from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import {useDeleteAccessLogRequest, useSendAccessLogRequest} from "@/hooks/access_logs";
import {useAuth} from "@/context/AuthContext";
import {Toast} from "toastify-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {IAccessLog} from "@/types/AccessLogs";
import {IRoomRaw} from "@/types/Room";
import {useRoomAccessCode} from "@/hooks/rooms";

interface StudentDoorRequestProps {
    userId: number;
    rooms: IRoomRaw[];
    setExistingDeniedAccessLog: (data: IAccessLog | null) => void;
    existingDeniedAccessLog: IAccessLog | null;
    setExistingApprovedAccessLog: (data: IAccessLog | null) => void;
    existingApprovedAccessLog: IAccessLog | null;
}

const StudentDoorRequest = ({
    userId,
    rooms,
    setExistingDeniedAccessLog,
    existingDeniedAccessLog,
    existingApprovedAccessLog,
    setExistingApprovedAccessLog
}: StudentDoorRequestProps) => {
    const {user, token} = useAuth();
    const [selectedRoom, setSelectedRoom] = useState<IRoomRaw | null>(null);
    const sendAccessLogMutation = useSendAccessLogRequest(
        `school/${user?.school_id}/access-logs`,
        token || ""
    )
    const deleteAccessLogMutation = useDeleteAccessLogRequest(
        `school/${user?.school_id}/access-logs`,
        token || "",
        existingDeniedAccessLog?.id,
    )
    const {
        data: roomAccessCode
    } = useRoomAccessCode(
        `school/${user?.school_id}/room_access_codes`,
        token || "",
        existingApprovedAccessLog?.room.id
    )
    console.log("approved from othwer rooms")
    console.log(existingApprovedAccessLog?.room.id)
    console.log("tym samym")
    console.log(roomAccessCode)


    const [modalVisible, setModalVisible] = useState(false);
    const [accessCode, setAccessCode] = useState("");

    const handleSelectRoom = (room_name: string) => {
        setSelectedRoom(rooms.find((room) => room.room_name === room_name) || null)
    }

    useEffect(() => {
        const getExistingAccessLog = async () => {
            const existingAccessLog = await AsyncStorage.getItem(`denied`)
            if (existingAccessLog)
                setExistingDeniedAccessLog(JSON.parse(existingAccessLog))
            else setExistingDeniedAccessLog(null)
        }
        getExistingAccessLog();
    }, [sendAccessLogMutation.isPending, deleteAccessLogMutation.isPending]);

    useEffect(() => {
        const getExistingAccessLog = async () => {
            const existingAccessLog = await AsyncStorage.getItem(`approved`)
            console.log("this is fetched from asyncstorage")
            console.log(existingAccessLog)
            if (existingAccessLog)
                setExistingApprovedAccessLog(JSON.parse(existingAccessLog))
            else setExistingApprovedAccessLog(null)
        }
        getExistingAccessLog();
    }, [sendAccessLogMutation.isPending]);

    const handleEnter = () => {
        console.log("WAZNE:")
        console.log(selectedRoom)
        console.log(existingDeniedAccessLog)
        console.log(roomAccessCode)
        if (!selectedRoom && !(existingApprovedAccessLog && roomAccessCode)) return
        console.log("wowyloje sie tak czy siak")
        setModalVisible(false);
        sendAccessLogMutation.mutate({
            user_id: userId,
            room_id: existingApprovedAccessLog?.room.id || selectedRoom?.id,
            access_code: existingApprovedAccessLog && roomAccessCode?.access_code || accessCode
        }, {
            onSuccess: async (data) => {
                setExistingApprovedAccessLog(null)
                await AsyncStorage.removeItem(`approved`)
                // if (data.access_status === "granted") {
                //     setGrantedModalVisible(true);
                // } else {
                //     setDeniedModalVisible(true);
                // }
            },

            onError: (err) => {
                Toast.error(err.message || "Failed to send request")
            }
        })
        setAccessCode("");
        setSelectedRoom(null);
    };

    const handleDelete = () => {
        deleteAccessLogMutation.mutate(null,
            {
                onSuccess: (data) => {
                    Toast.success("Successfully deleted");
                },
                onError: (err) => {
                    Toast.error(err.message || "Failed to send request");
                }
            })
    }
    if (existingDeniedAccessLog) {
        return (
            <View className="py-5 px-5 w-[80%]">
                <Text className="text-subtext text-2xl py-3 text-center leading-10">Your access request is waiting for approval</Text>
                <TouchableOpacity
                className="my-2 bg-red-500 py-3 px-4 rounded-2xl"
                onPress={handleDelete}
            >
                <Text className="text-white text-center font-semibold text-2xl">Delete request</Text>
            </TouchableOpacity>
            </View>
        )
    }
    if (existingApprovedAccessLog) {
        return (
            <View className="py-5 px-5 w-[80%]">
                <Text className="text-3xl font-normal text-subtext text-center pt-5">You are currently in class</Text>
                <TouchableOpacity
                  onPress={handleEnter}
                  className="bg-green-500 py-3 mt-4 mb-2 rounded-xl"
                >
                  <Text className="text-white text-xl text-center font-semibold">Leave classroom</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View className="p-5 w-[270px] bg-surface rounded-2xl shadow-xl my-3">
          <Text className="text-white text-xl mb-4 text-center font-medium">
                  Enter Room data
                </Text>
                <TextInput
                  value={selectedRoom?.room_name}
                  onChangeText={handleSelectRoom}
                  placeholder="Enter room"
                  placeholderTextColor="#7AC8F9"
                  className="bg-background text-white p-3 rounded-xl mb-4 text-center text-lg my-1"
                />
                <TextInput
                  value={accessCode}
                  onChangeText={setAccessCode}
                  keyboardType="numeric"
                  maxLength={4}
                  placeholder="Enter PIN"
                  placeholderTextColor="#7AC8F9"
                  className="bg-background text-white p-3 rounded-xl mb-4 text-center text-lg my-1"
                />
                <TouchableOpacity
                  onPress={handleEnter}
                  className="bg-green-500 py-3 mt-4 mb-2 rounded-xl"
                >
                  <Text className="text-white text-xl text-center font-semibold">Request for entry</Text>
                </TouchableOpacity>
          {/* Modal */}


            {/*<Modal*/}
            {/*      visible={grantedModalVisible}*/}
            {/*      transparent*/}
            {/*      animationType="fade"*/}
            {/*      onRequestClose={() => setGrantedModalVisible(false)}*/}
            {/*    >*/}
            {/*      <View className="flex-1 justify-center items-center bg-black/75">*/}
            {/*        <View className="bg-surface p-6 rounded-2xl w-4/5 shadow-lg">*/}
            {/*          <Text className="text-green-400 text-xl font-semibold text-center mb-4">*/}
            {/*              {*/}
            {/*                  existingAccessLog && !existingAccessLog?.access_end_time ? (*/}
            {/*                      "Access granted. You may enter the classroom."*/}
            {/*                  ) : (*/}
            {/*                      "You can leave the classroom."*/}
            {/*                  )*/}
            {/*              }*/}

            {/*          </Text>*/}
            {/*          <TouchableOpacity*/}
            {/*            onPress={() => setGrantedModalVisible(false)}*/}
            {/*            className="bg-primary py-3 mt-2 rounded-xl"*/}
            {/*          >*/}
            {/*            <Text className="text-white text-center font-medium">OK</Text>*/}
            {/*          </TouchableOpacity>*/}
            {/*        </View>*/}
            {/*      </View>*/}
            {/*    </Modal>*/}

            {/*    /!* Access Denied Modal *!/*/}
            {/*    <Modal*/}
            {/*      visible={deniedModalVisible}*/}
            {/*      transparent*/}
            {/*      animationType="fade"*/}
            {/*      onRequestClose={() => setDeniedModalVisible(false)}*/}
            {/*    >*/}
            {/*      <View className="flex-1 justify-center items-center bg-black/75">*/}
            {/*        <View className="bg-surface p-6 rounded-2xl w-4/5 shadow-lg">*/}
            {/*          <Text className="text-red-400 text-xl font-semibold text-center mb-4">*/}
            {/*            Access denied. You have no lesson in this room. Please wait for teacher approval.*/}
            {/*          </Text>*/}
            {/*          <TouchableOpacity*/}
            {/*            onPress={() => setDeniedModalVisible(false)}*/}
            {/*            className="bg-primary py-3 mt-2 rounded-xl"*/}
            {/*          >*/}
            {/*            <Text className="text-white text-center font-medium">OK</Text>*/}
            {/*          </TouchableOpacity>*/}
            {/*        </View>*/}
            {/*      </View>*/}
            {/*    </Modal>*/}
        </View>
    );
};

export default StudentDoorRequest;
