import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "@rneui/base";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home</Text>
      <Button
        title={"Logout"}
        onPress={async () => {
          await AsyncStorage.removeItem("email");
          await AsyncStorage.removeItem("password");
          navigation.replace("Root");
        }}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
