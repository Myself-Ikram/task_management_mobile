import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useContext, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../navigation/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Context from "../state_management/context";
import { TaskType } from "../state_management/context_provider";

type HomeScreenProps = NativeStackScreenProps<StackParamList, "Home">;

const Home: FC<HomeScreenProps> = ({ navigation }) => {
  const { myTasks, getMyTask } = useContext(Context);

  const logout = async () => {
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("password");
    navigation.replace("Root");
  };
  useEffect(() => {
    getMyTask();
  }, []);
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
        <TouchableOpacity
          onPress={() => navigation.navigate("Task", { status: 0 })}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 70, fontWeight: "bold", color: "white" }}>
            {myTasks?.length}
          </Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>All Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Task", { status: 2 })}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 50, fontWeight: "bold", color: "#ff7675" }}>
            {myTasks?.filter((t: TaskType) => t?.status === "pending")?.length}
          </Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Task", { status: 1 })}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 50, fontWeight: "bold", color: "#55efc4" }}>
            {
              myTasks?.filter((t: TaskType) => t?.status === "completed")
                ?.length
            }
          </Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>Completed</Text>
        </TouchableOpacity>
      </View>
      {/* Cards */}
      <ScrollView>
        <Text
          style={{ fontWeight: "bold", textAlign: "center", color: "white" }}
        >
          Today's List
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {[1, 1, 1, 1, 1, 1, 1, 1].map((item, index) => (
            <View key={index} style={{ width: "50%", padding: 15 }}>
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
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({});
