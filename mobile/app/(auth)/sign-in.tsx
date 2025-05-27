import { useState } from "react";
import { Text, TouchableOpacity, ScrollView } from "react-native";
import InputContainer from "@/components/forms/InputContainer"
import {useLogin} from "@/hooks/auth";
import {Toast} from "toastify-react-native";
import {ILoginData, ITokenOut} from "@/types/auth";
import {useRouter} from "expo-router";
import {useAuth} from "@/context/AuthContext";
const initialLoginValues = {
    email: "",
    password: "",
  }

const SignIn = () => {
    const router = useRouter()
    const {login} = useAuth();
    const loginMutation = useLogin();
    const [form, setForm] = useState<ILoginData>(initialLoginValues);


    const handleChange = (name: keyof ILoginData, value: string) => {
    setForm({ ...form, [name]: value });
    };


    const handleSubmit = () => {
    loginMutation.mutate(form, {
        onSuccess: async (data: ITokenOut) => {
            console.log(data);
            console.log("z tego tokena potem trzeba zrobić context");
            login(data.access_token)
        },
        onError: (error) => {
            Toast.error(error.message || "Failed to login");
        }
    });
    };

    return (
    <ScrollView className="flex-1 bg-background px-6 py-8">
      <Text className="text-white text-3xl font-bold mb-6 mt-[100px]">Sign In</Text>
        <InputContainer<ILoginData>
            value={form.email}
            handleChange={handleChange}
            name={"email"}
            label={"Email"}
        ></InputContainer>
         <InputContainer<ILoginData>
            value={form.password}
            handleChange={handleChange}
            name={"password"}
            label={"Password"}
        ></InputContainer>

        <TouchableOpacity
        onPress={handleSubmit}
        className="bg-primary py-3 rounded-xl mt-4"
        >
            <Text className="text-white text-center text-base font-medium">
              Log In
            </Text>
        </TouchableOpacity>
    </ScrollView>
  );
};

export default SignIn;
