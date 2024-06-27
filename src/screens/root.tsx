import { StyleSheet, Text, View } from "react-native";
import React, { FC, useContext, useEffect } from "react";
import { Button } from "@rneui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../navigation/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Context from "../state_management/context";

type RootScreenProps = NativeStackScreenProps<StackParamList, "Root">;

const Root: FC<RootScreenProps> = ({ navigation }) => {
  const { onload } = useContext(Context);
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
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Task Management System</Text>
    </View>
  );
};

export default Root;

const styles = StyleSheet.create({});
