import {
  StyleSheet,
  Text,
  View,
  Animated,
  ImageBackground,
} from "react-native";
import React, { FC, useContext, useEffect, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../navigation/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Context from "../state_management/context";

type RootScreenProps = NativeStackScreenProps<StackParamList, "Root">;

const Root: FC<RootScreenProps> = ({ navigation }) => {
  const title = ["Task", " Management", "System"];
  const { onload } = useContext(Context);
  // User Login check
  const userCredCheck = async () => {
    const email = await AsyncStorage.getItem("email");
    const password = await AsyncStorage.getItem("password");
    if (email && password) {
      navigation.replace("Home");
    } else {
      navigation.replace("Login");
    }
  };
  useEffect(() => {
    onload();
    setTimeout(() => {
      userCredCheck();
    }, 2000);
  }, []);

  // Animations
  const scaleAim = useRef(new Animated.Value(-500)).current;
  useEffect(() => {
    Animated.timing(scaleAim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [scaleAim]);

  return (
    <ImageBackground
      source={require("../../assets/bg-image.jpg")}
      style={[{ flex: 1, justifyContent: "center", alignItems: "center" }]}
    >
      <Animated.View
        style={[
          {
            justifyContent: "center",
            alignItems: "flex-start",
            borderLeftWidth: 10,
            paddingLeft: 10,
            borderColor: "white",
          },
          {
            top: scaleAim,
          },
        ]}
      >
        {title.map((l, idx) => (
          <Text
            key={idx}
            style={[{ fontSize: 40, fontWeight: "bold", color: "white" }]}
          >
            {l}
          </Text>
        ))}
      </Animated.View>
    </ImageBackground>
  );
};

export default Root;

const styles = StyleSheet.create({});
