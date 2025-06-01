import {ReactNode} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {AlertTriangle} from "lucide-react-native";

interface ErrorMessageProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    retryLabel?: string;
    icon?: ReactNode;
}

const ErrorMessage = ({
    title,
    message,
    onRetry,
    retryLabel,
    icon
}: ErrorMessageProps) => {
    return (
        <View className="flex-1 items-center justify-center bg-background px-6">
            <View className="items-center">
                {icon || <AlertTriangle size={48} color="#FF6B6B"/>}
                <Text className="text-white text-xl font-semibold mt-4 text-center">{title}</Text>
                <Text className="text-subtext text-base text-center mt-2">{message}</Text>
                {
                    onRetry && (
                        <TouchableOpacity
                            onPress={onRetry}
                            className="mt-6 bg-primary px-6 py-3 rounded-2xl"
                        >
                            <Text className="text-white text-base font-medium">{retryLabel}</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        </View>
    )
}
export default ErrorMessage;