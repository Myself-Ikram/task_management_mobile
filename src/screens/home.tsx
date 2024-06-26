import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useContext } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../navigation/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Context from "../state_management/context";

type HomeScreenProps = NativeStackScreenProps<StackParamList, "Home">;

const Home: FC<HomeScreenProps> = ({ navigation }) => {
  const logout = async () => {
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("password");
    navigation.replace("Root");
  };
  return (
    <ImageBackground
      source={require("../../assets/bg-half.png")}
      style={{ flex: 1, paddingTop: 75, padding: 10, gap: 10 }}
    >
      {/* Basic */}
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
            Welcome!
          </Text>
          <TouchableOpacity onPress={logout}>
            <MaterialIcon name="logout" size={40} color={"#ff7675"} />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 15, color: "white" }}>{Date()}</Text>
      </View>
      {/* Statistics */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 70, fontWeight: "bold", color: "white" }}>
            30
          </Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>All Tasks</Text>
        </View>
        <View>
          <Text style={{ fontSize: 50, fontWeight: "bold", color: "#ff7675" }}>
            30
          </Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>Pending</Text>
        </View>
        <View>
          <Text style={{ fontSize: 50, fontWeight: "bold", color: "#55efc4" }}>
            30
          </Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>Completed</Text>
        </View>
      </View>
      {/* Cards */}
      <ScrollView>
        <Text
          style={{ fontWeight: "bold", textAlign: "center", color: "white" }}
        >
          Today's List
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {[1, 1, 1, 1, 1, 1, 1, 1].map((i) => (
            <View style={{ width: "50%", padding: 15 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  height: 150,
                  elevation: 10,
                  borderRadius: 15,
                  // padding: 10,
                  justifyContent: "space-between",
                  overflow: "hidden",
                }}
              >
                {/* <MaterialIcon name="task" size={50} color={"#55efc4"} /> */}
                {/* <MaterialIcon name="pending" size={50} color={"#ff7675"} /> */}
                <View
                  style={{
                    padding: 10,
                    height: "90%",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 10, fontWeight: "700" }}>
                      Title:
                    </Text>
                    <Text style={{ fontWeight: "300" }}>
                      Poue Water to the plants
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 10, fontWeight: "700" }}>
                      Deadline:
                    </Text>
                    <Text style={{ fontWeight: "300" }}>Tomorrow</Text>
                  </View>
                </View>
                <View
                  style={{
                    height: "10%",
                    width: "100%",
                    backgroundColor: "#55efc4",
                  }}
                ></View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      {/* <Text>Home</Text>
          <Button
            title="Outline"
            type="outline"
            onPress={() => {
              navigation.navigate("Task");
            }}
          />
          <Button title="Logout" type="outline" onPress={logout} /> */}
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({});
