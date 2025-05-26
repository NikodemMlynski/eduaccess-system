import { useState, ReactNode } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import InputContainer from "@/components/forms/InputContainer"
import {IUserIn} from "@/types/User";
import {useCreateUser} from "@/hooks/users";
import {Toast} from "toastify-react-native";

interface IErrors {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    addition_code?: string;
}

const initialUserValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    addition_code: "",
    role: "student",
  }

const SignUp = () => {
  const createUserMutation = useCreateUser();
  const [form, setForm] = useState<IUserIn>(initialUserValues);

  const [errors, setErrors] = useState<IErrors>({});

  const handleChange = (name: keyof IUserIn, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.first_name) newErrors.first_name = "Imię jest wymagane";
    if (!form.last_name) newErrors.last_name = "Nazwisko jest wymagane";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Niepoprawny email";
    if (!form.password || form.password.length < 6) newErrors.password = "Hasło musi mieć min. 6 znaków";
    if (!form.addition_code) newErrors.addition_code = "Kod dodatkowy jest wymagany";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      createUserMutation.mutate({...form, role: "student"}, {
        onSuccess: () => {
          Toast.success("Success message")
          console.log("tu musi być redirect jeszcze")
          setForm(initialUserValues);
        },
        onError: (err) => {
          Toast.error(err.message || "Failed to sign up")
        }
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-background px-6 py-8">
      <Text className="text-white text-3xl font-bold mb-6 mt-[100px]">Utwórz konto</Text>
        <InputContainer<IUserIn>
            value={form.first_name}
            handleChange={handleChange}
            name={"first_name"}
            label={"First Name"}
        >
            {errors.first_name && (
                <Text className="text-red-400 text-sm mt-1">{errors["first_name"]}</Text>
            )}
        </InputContainer>
         <InputContainer<IUserIn>
            value={form.last_name}
            handleChange={handleChange}
            name={"last_name"}
            label={"Last Name"}
        >
            {errors.last_name && (
                <Text className="text-red-400 text-sm mt-1">{errors["last_name"]}</Text>
            )}
        </InputContainer>
         <InputContainer<IUserIn>
            value={form.email}
            handleChange={handleChange}
            name={"email"}
            label={"Email"}
        >
            {errors.email && (
                <Text className="text-red-400 text-sm mt-1">{errors["email"]}</Text>
            )}
        </InputContainer>
        <InputContainer<IUserIn>
            value={form.password}
            handleChange={handleChange}
            name={"password"}
            label={"Password"}
            secureTextEntry={true}
        >
            {errors.password && (
                <Text className="text-red-400 text-sm mt-1">{errors["password"]}</Text>
            )}
        </InputContainer>
        <InputContainer<IUserIn>
            value={form.addition_code}
            handleChange={handleChange}
            name={"addition_code"}
            label={"Addition Code"}
        >
            {errors.addition_code && (
                <Text className="text-red-400 text-sm mt-1">{errors["addition_code"]}</Text>
            )}
        </InputContainer>

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-primary py-3 rounded-xl mt-4"
      >
        <Text className="text-white text-center text-base font-medium">
          Zarejestruj się
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignUp;
