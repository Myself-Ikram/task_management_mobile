import {
  ImageBackground,
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
import Modal from "react-native-modal";
import { Animated } from "react-native";
type HomeScreenProps = NativeStackScreenProps<StackParamList, "Home">;

const daysOfWeek: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Home: FC<HomeScreenProps> = ({ navigation }) => {
  // Context Data
  const { myTasks, getMyTask, changeTaskStatus } = useContext(Context);
  const [shownTask, setShownTask] = useState<TaskType[]>([]);
  // getting mytasks on load
  useEffect(() => {
    getMyTask();
  }, []);
  // Date/Day Variables
  const today = new Date();
  const nextFourDays: Date[] = [];
  const [currentDate, setCurrentDate] = useState(0);
  const [currentItem, setCurrentItem] = useState<TaskType>();
  for (let i = 1; i < 5; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + i);
    nextFourDays.push(nextDate);
  }
  // Modal
  const [showModal, setShowModal] = useState(false);
  // Filters
  const filters = ["Today", "Upcoming"];
  const [currentFilter, setCurrentFilter] = useState(0);
  const isLoaded = useRef(false);
  // Filter Tasks
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

  // Log Out
  const logout = async () => {
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("password");
    navigation.replace("Root");
  };

  // Animations
  // Ref Object for multiple components
  const numberElements = [
    { id: "all", ref: useRef(new Animated.Value(0)).current },
    { id: "pending", ref: useRef(new Animated.Value(0)).current },
    { id: "completed", ref: useRef(new Animated.Value(0)).current },
    { id: "filter", ref: useRef(new Animated.Value(0)).current },
  ];
  useEffect(() => {
    Animated.parallel(
      numberElements.map((item, idx) => {
        if (item.id !== "filter") {
          return Animated.spring(item.ref, {
            toValue: 1,
            friction: 2,
            delay: 10 * idx,
            useNativeDriver: true,
          });
        } else {
          return Animated.timing(item.ref, {
            toValue: 1,
            duration: 1000,
            delay: 50 * idx,
            useNativeDriver: true,
          });
        }
      })
    ).start();
  }, []);

  // Scroll
  const scrollY = new Animated.Value(0);

  // Task Complete
  const statusRef = useRef(new Animated.Value(0)).current;
  const [taskAni, setTaskAni] = useState(false);
  const handleCheck = (item: TaskType) => {
    setCurrentItem(item);
    if (item.status === "pending") {
      setTaskAni(true);
    }
    setTimeout(
      () => {
        setTaskAni(false);
        changeTaskStatus(item);
        statusRef.setValue(0);
      },
      item?.status === "pending" ? 2000 : 100
    );

    isLoaded.current = false;
  };
  useEffect(() => {
    Animated.timing(statusRef, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [taskAni]);

  return (
    <ImageBackground
      source={require("../../assets/bg-half.png")}
      style={{ flex: 1, paddingTop: 75, padding: 10, gap: 10 }}
    >
      {/* Basic Intro */}
      <Animated.View>
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
      </Animated.View>
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
          <Animated.Text
            style={[
              { fontSize: 70, fontWeight: "bold", color: "white" },
              { transform: [{ scale: numberElements[0].ref }] },
            ]}
          >
            {myTasks?.length}
          </Animated.Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>All Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Task", { status: 1 });
            isLoaded.current = false;
          }}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Animated.Text
            style={[
              { fontSize: 50, fontWeight: "bold", color: "#ff7675" },
              { transform: [{ scale: numberElements[1].ref }] },
            ]}
          >
            {myTasks?.filter((t: TaskType) => t?.status === "pending")?.length}
          </Animated.Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Task", { status: 2 });
            isLoaded.current = false;
          }}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <Animated.Text
            style={[
              { fontSize: 50, fontWeight: "bold", color: "#55efc4" },
              { transform: [{ scale: numberElements[2].ref }] },
            ]}
          >
            {
              myTasks?.filter((t: TaskType) => t?.status === "completed")
                ?.length
            }
          </Animated.Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>Completed</Text>
        </TouchableOpacity>
      </View>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Filter */}
        <View
          style={[
            {
              flexDirection: "row",
              justifyContent: "center",
              alignSelf: "center",
              gap: 20,
              marginBottom: 10,
              borderColor: "white",
              borderWidth: 0.5,
              borderRadius: 15,
              overflow: "hidden",
            },
          ]}
        >
          {filters.map((f, idx) => (
            <Animated.View
              key={idx}
              style={[{}, { opacity: numberElements[3].ref }]}
            >
              <TouchableOpacity onPress={() => setCurrentFilter(idx)}>
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
            </Animated.View>
          ))}
        </View>
        {/* Day Filter */}
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
        {/* Task Cards */}
        <View style={[{ flexDirection: "row", flexWrap: "wrap" }]}>
          {shownTask?.map((item, index) => {
            const inputRange = [-1, 0, 100 * index, 100 * (index + 5)];
            const result = scrollY.interpolate({
              inputRange,
              outputRange: [1, 1, 1, 0],
              extrapolate: "clamp",
            });
            return (
              <View
                key={index}
                style={[
                  {
                    width: "50%",
                    padding: 15,
                  },
                ]}
              >
                <Animated.View
                  style={[
                    {
                      backgroundColor: "white",
                      height: 150,
                      marginTop: index % 2 !== 0 ? 25 : 0,
                      opacity: taskAni ? (currentItem === item ? 1 : 0.5) : 1,
                      elevation: 10,
                      borderRadius: 12,
                      justifyContent: "space-between",
                      overflow: "hidden",
                    },
                    { transform: [{ scale: result }] },
                  ]}
                >
                  {currentItem === item && taskAni ? (
                    <Animated.View
                      style={[
                        {
                          height: "90%",
                          backgroundColor: "#55efc4",
                          justifyContent: "center",
                          alignItems: "center",
                        },
                        { transform: [{ scale: statusRef }] },
                      ]}
                    >
                      <MaterialIcon
                        name="done-outline"
                        size={30}
                        color={"white"}
                      />
                    </Animated.View>
                  ) : (
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
                        <TouchableOpacity
                          disabled={taskAni}
                          onPress={() => handleCheck(item)}
                        >
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
                          disabled={taskAni}
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
                  )}
                  <View
                    style={{
                      height: "10%",
                      width: "100%",
                      backgroundColor:
                        item?.status === "pending" ? "#ff7675" : "#55efc4",
                    }}
                  ></View>
                </Animated.View>
              </View>
            );
          })}
        </View>
      </Animated.ScrollView>
      {/* Task View Modal */}
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
