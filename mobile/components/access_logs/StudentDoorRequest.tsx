import React, {useEffect, useState} from "react";
import {
  Modal,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { format } from "date-fns";
import {ILessonInstance} from "@/types/schedule";
import {useSendAccessLogRequest} from "@/hooks/access_logs";
import {useAuth} from "@/context/AuthContext";
import {Toast} from "toastify-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {IAccessLog} from "@/types/AccessLogs";

interface StudentDoorRequestProps {
  lesson: ILessonInstance;
  userId: number;
}

const StudentDoorRequest = ({
    lesson,
    userId
}: StudentDoorRequestProps) => {
    const {user, token} = useAuth();
    const [existingAccessLog, setExistingAccessLog] = useState<IAccessLog | null>(null);
    const sendAccessLogMutation = useSendAccessLogRequest(
        `school/${user?.school_id}/access-logs`,
        token || ""
    )
    useEffect(() => {
        const getExistingAccessLog = async () => {
            const existingAccessLog = await AsyncStorage.getItem(`${lesson.room.id}`)
            console.log(existingAccessLog)
            if (existingAccessLog)
                setExistingAccessLog(JSON.parse(existingAccessLog))
            else setExistingAccessLog(null)
        }
        getExistingAccessLog();
    }, [sendAccessLogMutation.isPending]);


    const [grantedModalVisible, setGrantedModalVisible] = useState(false);
    const [deniedModalVisible, setDeniedModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [accessCode, setAccessCode] = useState("");


    const handleEnter = () => {
        setModalVisible(false);
        sendAccessLogMutation.mutate({
            user_id: userId,
            room_id: lesson.room.id,
            access_code: accessCode
        }, {
            onSuccess: (data) => {
                if (data.access_status === "granted") {
                    setGrantedModalVisible(true);
                } else {
                    setDeniedModalVisible(true);
                }
            },

            onError: (err) => {
                Toast.error(err.message || "Failed to send request")
            }
        })
        setAccessCode("");
    };
    return (
        <View className="p-5 w-[270px] bg-background rounded-2xl shadow-xl my-10">
            <View className="flex flex-row py-1 px-3 gap-5 items-center">
                <Text className="text-white font-semibold mb-1 text-2xl">{lesson.subject}</Text>
                <Text className="text-subtext text-xl">{lesson.room.room_name}</Text>
            </View>

          <Text className="text-subtext text-lg mb-4 px-3">
            {format(new Date(lesson.start_time), "HH:mm")} - {format(new Date(lesson.end_time), "HH:mm")}
          </Text>

          <TouchableOpacity
            className="my-2 bg-primary py-3 px-4 rounded-2xl"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white text-center font-semibold text-2xl">{
                              existingAccessLog && !existingAccessLog?.access_end_time ? (
                                  "Leave"
                              ) : (
                                  "Enter"
                              )
                          } classroom</Text>
          </TouchableOpacity>

          {/* Modal */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/75">
              <View className="bg-surface p-6 rounded-2xl w-4/5 shadow-lg">
                <Text className="text-white text-2xl mb-4 text-center font-medium">
                  Enter PIN Code
                </Text>
                <TextInput
                  value={accessCode}
                  onChangeText={setAccessCode}
                  keyboardType="numeric"
                  maxLength={4}
                  placeholder="Enter PIN"
                  placeholderTextColor="#7AC8F9"
                  className="bg-background text-white p-3 rounded-xl mb-4 text-center text-xl my-1"
                />
                <TouchableOpacity
                  onPress={handleEnter}
                  className="bg-green-500 py-3 mt-4 mb-2 rounded-xl"
                >
                  <Text className="text-white text-xl text-center font-semibold">{
                              existingAccessLog && !existingAccessLog?.access_end_time ? (
                                  "Leave"
                              ) : (
                                  "Enter"
                              )
                          }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

            <Modal
                  visible={grantedModalVisible}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setGrantedModalVisible(false)}
                >
                  <View className="flex-1 justify-center items-center bg-black/75">
                    <View className="bg-surface p-6 rounded-2xl w-4/5 shadow-lg">
                      <Text className="text-green-400 text-xl font-semibold text-center mb-4">
                          {
                              existingAccessLog && !existingAccessLog?.access_end_time ? (
                                  "Access granted. You may enter the classroom."
                              ) : (
                                  "You can leave the classroom."
                              )
                          }

                      </Text>
                      <TouchableOpacity
                        onPress={() => setGrantedModalVisible(false)}
                        className="bg-primary py-3 mt-2 rounded-xl"
                      >
                        <Text className="text-white text-center font-medium">OK</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>

                {/* Access Denied Modal */}
                <Modal
                  visible={deniedModalVisible}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setDeniedModalVisible(false)}
                >
                  <View className="flex-1 justify-center items-center bg-black/75">
                    <View className="bg-surface p-6 rounded-2xl w-4/5 shadow-lg">
                      <Text className="text-red-400 text-xl font-semibold text-center mb-4">
                        Access denied. You have no lesson in this room. Please wait for teacher approval.
                      </Text>
                      <TouchableOpacity
                        onPress={() => setDeniedModalVisible(false)}
                        className="bg-primary py-3 mt-2 rounded-xl"
                      >
                        <Text className="text-white text-center font-medium">OK</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
        </View>
    );
};

export default StudentDoorRequest;
