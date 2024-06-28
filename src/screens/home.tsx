import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../navigation/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Context from "../state_management/context";
import { TaskType } from "../state_management/context_provider";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
type HomeScreenProps = NativeStackScreenProps<StackParamList, "Home">;

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const Home: FC<HomeScreenProps> = ({ navigation }) => {
  const { myTasks, getMyTask, changeTaskStatus } = useContext(Context);
  const today = new Date();
  const nextFourDays: Date[] = [];
  for (let i = 1; i < 5; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + i);
    nextFourDays.push(nextDate);
  }
  const [showModal, setShowModal] = useState(false);
  const [shownTask, setShownTask] = useState<TaskType[]>([]);
  // Filters
  const filters = ["Today", "Upcoming"];
  const [currentFilter, setCurrentFilter] = useState(0);
  const [currentDate, setCurrentDate] = useState(0);
  const [currentItem, setCurrentItem] = useState<TaskType>();
  const isLoaded = useRef(false);
  const filterMyTasks = () => {
    if (currentFilter === 0) {
      setShownTask(
        myTasks?.filter(
          (t: TaskType) =>
            new Date(t?.due_date)?.toISOString()?.slice(0, 10) ===
            today?.toISOString()?.slice(0, 10)
        )
      );
    } else {
      setShownTask(
        myTasks?.filter(
          (t: TaskType) =>
            new Date(t?.due_date)?.toISOString()?.slice(0, 10) ===
            nextFourDays[currentDate]?.toISOString()?.slice(0, 10)
        )
      );
    }
  };
  useEffect(() => {
    filterMyTasks();
  }, [myTasks, currentFilter, currentDate]);

  const logout = async () => {
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("password");
    navigation.replace("Root");
  };
  useEffect(() => {
    getMyTask();
  }, []);
  const handleCheck = (item: TaskType) => {
    changeTaskStatus(item);
    isLoaded.current = false;
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
        <Text style={{ fontSize: 15, color: "white" }}>
          {today.toLocaleString()}
        </Text>
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
          onPress={() => {
            navigation.navigate("Task", { status: 0 });
            isLoaded.current = false;
          }}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 70, fontWeight: "bold", color: "white" }}>
            {myTasks?.length}
          </Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>All Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Task", { status: 1 });
            isLoaded.current = false;
          }}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 50, fontWeight: "bold", color: "#ff7675" }}>
            {myTasks?.filter((t: TaskType) => t?.status === "pending")?.length}
          </Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Task", { status: 2 });
            isLoaded.current = false;
          }}
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignSelf: "center",
            gap: 20,
            marginBottom: 10,
            borderColor: "white",
            borderWidth: 0.5,
            borderRadius: 15,
            overflow: "hidden",
          }}
        >
          {filters.map((f, idx) => (
            <TouchableOpacity key={idx} onPress={() => setCurrentFilter(idx)}>
              <Text
                style={{
                  color: currentFilter === idx ? "black" : "white",
                  fontSize: 12,
                  padding: 10,
                  borderRadius: 15,
                  backgroundColor:
                    currentFilter === idx ? "white" : "transparent",
                }}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {currentFilter === 1 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 10,
            }}
          >
            {nextFourDays.map((d, idx) => (
              <TouchableOpacity
                key={idx}
                style={{
                  backgroundColor: currentDate === idx ? "#3498db" : "white",
                  alignItems: "center",
                  padding: 15,
                  elevation: currentDate === idx ? 5 : 20,
                  borderRadius: 10,
                }}
                onPress={() => setCurrentDate(idx)}
              >
                <Text
                  style={{
                    fontSize: 30,
                    color: currentDate === idx ? "white" : "#3498db",
                    fontWeight: "bold",
                  }}
                >
                  {d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}
                </Text>
                <Text
                  style={{
                    color: currentDate === idx ? "white" : "#3498db",
                    fontWeight: "300",
                  }}
                >
                  {daysOfWeek[d.getDay()]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {shownTask?.map((item, index) => (
            <View key={index} style={{ width: "50%", padding: 15 }}>
              <View
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
                <View
                  style={{
                    padding: 10,
                    height: "90%",
                    justifyContent: "space-around",
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 10, fontWeight: "700" }}>
                      Title:
                    </Text>
                    <Text style={{ fontWeight: "300" }}>{item?.title}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity onPress={() => handleCheck(item)}>
                      <MaterialCIcon
                        name={
                          item?.status === "completed"
                            ? "checkbox-blank"
                            : "checkbox-blank-outline"
                        }
                        size={30}
                        color={"#3498db"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowModal(true);
                        setCurrentItem(item);
                      }}
                    >
                      <MaterialIcon
                        name="play-arrow"
                        size={35}
                        color={"#3498db"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    height: "10%",
                    width: "100%",
                    backgroundColor:
                      item?.status === "pending" ? "#ff7675" : "#55efc4",
                  }}
                ></View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      {/* View Modal */}
      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        swipeDirection={["down"]}
        onSwipeComplete={() => setShowModal(false)}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 15,
            borderRadius: 10,
            gap: 15,
            minHeight: 200,
          }}
        >
          <View>
            <Text
              style={{
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: 25,
                textAlign: "center",
                backgroundColor: "#74b9ff",
                padding: 5,
                borderRadius: 10,
                color: "white",
                elevation: 10,
                marginBottom: 10,
              }}
            >
              Details
            </Text>
            <View>
              <Text
                style={{
                  fontWeight: "800",
                  color: "#74b9ff",
                  opacity: 0.8,
                }}
              >
                TITLE
              </Text>
              <Text style={{ textTransform: "capitalize", fontWeight: "300" }}>
                {currentItem?.title}
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontWeight: "800",
                color: "#74b9ff",
                opacity: 0.8,
              }}
            >
              DESCRIPTION
            </Text>
            <Text style={{ textTransform: "capitalize", fontWeight: "300" }}>
              {currentItem?.desc}
            </Text>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({});
