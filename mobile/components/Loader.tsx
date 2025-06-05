import {Animated, Easing, View} from "react-native";
import { useEffect, useRef } from "react";
import {Loader2} from "lucide-react-native";

const Loader = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "60%",
      }}
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Loader2 size={60} color="#00CFFF" />
      </Animated.View>
    </View>
  );
};

export default Loader;