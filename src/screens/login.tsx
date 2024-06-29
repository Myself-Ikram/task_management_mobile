import {
  Alert,
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { ButtonGroup, Input, Icon, Button } from "@rneui/themed";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../navigation/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Context from "../state_management/context";
import { UserType } from "../state_management/context_provider";

type LoginScreenProps = NativeStackScreenProps<StackParamList, "Login">;

const Login: FC<LoginScreenProps> = ({ navigation }) => {
  // Context Data
  const { users, addUser, setUserId, eraseData } = useContext(Context);
  // Variables
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputCred, setInputCred] = useState({
    email: "",
    password: "",
  });
  //Login Submit
  const handleSubmit = async () => {
    if (inputCred.email === "" || inputCred.password === "") {
      setIsBouncing(true);
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
        setIsBouncing(true);
      }
    } else {
      addUser(inputCred);
      setUserId(inputCred.email);
      await AsyncStorage.setItem("email", inputCred.email);
      await AsyncStorage.setItem("password", inputCred.password);
      navigation.replace("Home");
    }
  };
  // Animations
  const elements = [
    { id: "reset", ref: useRef(new Animated.Value(0)).current },
    { id: "login_register", ref: useRef(new Animated.Value(0)).current },
    { id: "email", ref: useRef(new Animated.Value(0)).current },
    { id: "password", ref: useRef(new Animated.Value(0)).current },
    { id: "submit", ref: useRef(new Animated.Value(0)).current },
  ];
  const viewRef = useRef(new Animated.Value(-500)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(viewRef, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
    Animated.sequence(
      elements.map((item, idx) =>
        Animated.spring(item.ref, {
          toValue: item.id === "email" || item.id === "password" ? 0.8 : 1,
          friction: 6,
          delay: idx === 0 ? 1000 : 0,
          useNativeDriver: false,
        })
      )
    ).start();
  }, []);
  // Bouncing Effect (Submit Button)
  const [isBouncing, setIsBouncing] = useState(false);
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isBouncing) {
      Animated.sequence(
        [1, -1, 1, -1, 1, 0].map((i) =>
          Animated.timing(bounceAnim, {
            toValue: i,
            duration: 100,
            useNativeDriver: true,
          })
        )
      ).start(() => setIsBouncing(false));
    }
  }, [isBouncing, bounceAnim]);

  return (
    <ImageBackground
      source={require("../../assets/bg-image.jpg")}
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <Animated.View style={{ transform: [{ scale: elements[0].ref }] }}>
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
      </Animated.View>
      {/* Inputs */}
      <Animated.View
        style={[
          {
            backgroundColor: "white",
            width: "95%",
            paddingTop: 30,
            height: 380,
            borderRadius: 40,
            marginBottom: 50,
            elevation: 30,
          },
          { top: viewRef },
        ]}
      >
        {/* Login/Register */}
        <Animated.View style={[{ transform: [{ scale: elements[1].ref }] }]}>
          <ButtonGroup
            buttons={["Login", "Register"]}
            selectedIndex={selectedIndex}
            onPress={(value) => {
              setSelectedIndex(value);
            }}
            containerStyle={{ marginBottom: 20 }}
          />
        </Animated.View>
        <View
          style={{
            flex: 1,
            width: "100%",
            paddingHorizontal: 20,
            marginTop: 20,
          }}
        >
          <View style={{ gap: 10 }}>
            {/* Email */}
            <Animated.View
              style={[
                {},
                {
                  transform: [{ scale: elements[2].ref }],
                },
              ]}
            >
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
            </Animated.View>
            {/* Password */}
            <Animated.View
              style={[{}, { transform: [{ scale: elements[3].ref }] }]}
            >
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
            </Animated.View>
          </View>
          {/* Submit */}
          <Animated.View
            style={[
              { margin: 25 },
              {
                transform: [
                  {
                    translateX: bounceAnim.interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: [-10, 0, 10],
                    }),
                  },
                  {
                    scale: elements[4].ref,
                  },
                ],
              },
            ]}
          >
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
          </Animated.View>
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({});
