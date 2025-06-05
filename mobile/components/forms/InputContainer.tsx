import {ReactNode} from "react";
import {Text, TextInput, View} from "react-native";

interface InputContainerProps<T> {
    label: string;
    handleChange: (name: keyof T, value: string) => void;
    value: string;
    name: keyof T;
    children?: ReactNode;
}

const InputContainer = <T, >({
    label,
    handleChange,
    value,
    name,
    children,
    ...props
}: InputContainerProps<T>) => (
    <View className="mb-5">
            <Text className="text-subtext mb-1 capitalize">
                {label}
            </Text>
            <TextInput
                className="bg-surface text-white px-4 py-3 rounded-xl border border-surface focus:border-accent"
                placeholderTextColor="#7AC8F9"
                autoCapitalize="none"
                value={value}
                onChangeText={(text) => handleChange(name, text)}
                {...props}
            />
            {children}
        </View>
)
export default InputContainer;