import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { FC, useContext, useEffect, useState } from "react";
import { ButtonGroup, Input, Icon, Button } from "@rneui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../navigation/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Context from "../state_management/context";
import { UserType } from "../state_management/context_provider";

type LoginScreenProps = NativeStackScreenProps<StackParamList, "Login">;

const Login: FC<LoginScreenProps> = ({ navigation }) => {
  const { users, addUser, setUserId, eraseData } = useContext(Context);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputCred, setInputCred] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (inputCred.email === "" || inputCred.password === "") {
      Alert.alert("empty");
      return;
    }
    if (selectedIndex === 0) {
      const user = users.find(
        (u: UserType) =>
          u?.email === inputCred.email && u?.password === inputCred.password
      );
      if (user) {
        navigation.replace("Home");
        setUserId(inputCred.email);
        await AsyncStorage.setItem("email", inputCred.email);
        await AsyncStorage.setItem("password", inputCred.password);
      } else {
        Alert.alert("Wrong Credentials");
      }
    } else {
      addUser(inputCred);
      setUserId(inputCred.email);
      await AsyncStorage.setItem("email", inputCred.email);
      await AsyncStorage.setItem("password", inputCred.password);
      navigation.replace("Home");
    }
  };
  return (
    <ImageBackground
      source={require("../../assets/bg-image.jpg")}
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <Button
        title="Reset All"
        onPress={eraseData}
        titleStyle={{ fontWeight: "bold", color: "black" }}
        buttonStyle={{
          backgroundColor: "white",
          borderWidth: 0,
          borderRadius: 30,
          marginBottom: 30,
        }}
      />
      {/* Inputs */}
      <View
        style={{
          backgroundColor: "white",
          width: "95%",
          paddingTop: 30,
          height: 420,
          borderRadius: 40,
          marginBottom: 50,
          elevation: 30,
        }}
      >
        <ButtonGroup
          buttons={["Login", "Register"]}
          selectedIndex={selectedIndex}
          onPress={(value) => {
            setSelectedIndex(value);
          }}
          containerStyle={{ marginBottom: 20 }}
        />
        <View
          style={{
            flex: 1,
            width: "100%",
            paddingHorizontal: 20,
            justifyContent: "center",
          }}
        >
          <View style={{ gap: 10 }}>
            <View>
              <Text style={{ color: "#3498db" }}>Email</Text>
              <TextInput
                value={inputCred.email}
                placeholder="Enter your email"
                onChangeText={(txt) => {
                  setInputCred({ ...inputCred, email: txt });
                }}
                style={{
                  borderWidth: 2,
                  borderColor: "#3498db",
                  borderRadius: 5,
                  fontSize: 20,
                  padding: 7.5,
                }}
              />
            </View>
            <View>
              <Text style={{ color: "#3498db" }}>Password</Text>
              <TextInput
                value={inputCred.password}
                placeholder="Enter your password"
                onChangeText={(txt) => {
                  setInputCred({ ...inputCred, password: txt });
                }}
                style={{
                  borderWidth: 2,
                  borderColor: "#3498db",
                  borderRadius: 5,
                  fontSize: 20,
                  padding: 7.5,
                }}
              />
            </View>
          </View>
          <View style={{ margin: 25 }}>
            <Button
              title="Submit"
              onPress={handleSubmit}
              titleStyle={{ fontWeight: "bold" }}
              buttonStyle={{
                backgroundColor: "#3498db",
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 30,
              }}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({});
