import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useContext, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../navigation/navigation";
import OctiIcon from "react-native-vector-icons/Octicons";
import MaterialCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modal";
import { Button, Input } from "@rneui/base";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Context from "../state_management/context";
import { TaskType } from "../state_management/context_provider";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TaskScreenProps = NativeStackScreenProps<StackParamList, "Task">;

const Task: FC<TaskScreenProps> = ({ navigation, route }) => {
  // Data
  const {
    myTasks: tasks,
    addTask,
    changeTaskStatus,
    editTask,
    removeTask,
  } = useContext(Context);
  const [myTasks, setMyTasks] = useState<TaskType[]>([]);
  const [reReq, setReReq] = useState(false);
  // Filters
  const filters = ["All", "Completed", "Pending"];
  const [currentFilter, setCurrentFilter] = useState(route.params.status);
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"edit" | "add">("add");
  const [currentItem, setCurrentItem] = useState<TaskType>();

  useEffect(() => {
    (async () => {
      if (currentFilter === 0) {
        setMyTasks(tasks);
      } else if (currentFilter === 1) {
        setMyTasks(tasks?.filter((i: TaskType) => i?.status === "completed"));
      } else {
        setMyTasks(tasks?.filter((i: TaskType) => i?.status === "pending"));
      }
    })();
  }, [currentFilter, reReq]);
  const handleCheck = (item: TaskType) => {
    changeTaskStatus(item);
    setReReq(!reReq);
  };
  const handleDelete = (item: TaskType) => {
    removeTask(item);
    setReReq(!reReq);
  };
  return (
    <View style={{ flex: 1, gap: 20 }}>
      <View style={{ borderRadius: 30, overflow: "hidden" }}>
        <ImageBackground
          source={require("../../assets/bg-image.jpg")}
          style={{
            height: 175,
            justifyContent: "flex-end",
            gap: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{ paddingLeft: 15 }}
              onPress={() => navigation.goBack()}
            >
              <OctiIcon name="arrow-left" size={30} />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                }}
              >
                My Tasks
              </Text>
            </View>
          </View>
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
        </ImageBackground>
      </View>
      {/* Task List */}
      <FlatList
        data={myTasks}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        renderItem={({ item }: { item: TaskType }) => (
          <View
            style={{
              backgroundColor: "white",
              height: 150,
              borderRadius: 25,
              overflow: "hidden",
              elevation: 5,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  backgroundColor:
                    item?.status === "pending" ? "#ff7675" : "#55efc4",
                  width: 100,
                  height: 100,
                  padding: 15,
                }}
              >
                <ImageBackground
                  source={require("../../assets/calendar.png")}
                  style={{
                    height: "100%",
                    width: "100%",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                    {new Date(item?.due_date)?.getDate()}
                  </Text>
                  <Text style={{ fontSize: 12, textTransform: "uppercase" }}>
                    {new Date(item?.due_date)
                      ?.toLocaleString("default", {
                        month: "long",
                      })
                      ?.slice(0, 3)}
                  </Text>
                </ImageBackground>
              </View>
              <View style={{ padding: 5, flex: 1 }}>
                <View>
                  <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                    Title
                  </Text>
                  <Text style={{ fontWeight: "300" }}>{item?.title}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                    Description
                  </Text>
                  <Text style={{ fontWeight: "300" }}>
                    This is a description and does not to meant harm any one
                    handle with care
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                height: 50,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setCurrentItem(item);
                  setModalType("edit");
                  setShowModal(true);
                }}
              >
                <MaterialCIcon
                  name="notebook-edit-outline"
                  size={25}
                  color={"#3498db"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleCheck(item)}>
                <MaterialCIcon
                  name={
                    item?.status === "completed"
                      ? "checkbox-blank"
                      : "checkbox-blank-outline"
                  }
                  size={25}
                  color={"#3498db"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <MaterialCIcon
                  name="delete-variant"
                  size={25}
                  color={"#ff7675"}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {/* Float btn to add task */}
      <TouchableOpacity
        style={styles.b}
        onPress={() => {
          setShowModal(true);
          setCurrentItem(undefined);
          setModalType("add");
        }}
      >
        <OctiIcon name="plus" size={30} color={"white"} />
      </TouchableOpacity>
      {/* Add Modal */}
      <TaskModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalType={modalType}
        addTask={addTask}
        editTask={editTask}
        data={currentItem}
        reReq={reReq}
        setReReq={setReReq}
      />
    </View>
  );
};

export default Task;

const TaskModal = ({
  showModal,
  setShowModal,
  modalType,
  addTask,
  editTask,
  data,
  reReq,
  setReReq,
}: {
  showModal: boolean;
  setShowModal: (newState: boolean) => void;
  modalType: "add" | "edit";
  addTask: (item: TaskType) => void;
  editTask: (item1: TaskType, item2: TaskType) => void;
  data?: TaskType;
  reReq: boolean;
  setReReq: (item: boolean) => void;
}) => {
  const [newTask, setnewTask] = useState<TaskType>({
    title: "",
    desc: "",
    due_date: new Date(),
    status: "pending",
  });
  useEffect(() => {
    if (modalType === "edit" && data) {
      setnewTask(data);
    } else {
      setnewTask({
        title: "",
        desc: "",
        due_date: new Date(),
        status: "pending",
      });
    }
  }, [data]);

  // Checking all inputs are not empty
  const [inputsCheck, setInputCheck] = useState(false);
  useEffect(() => {
    setInputCheck(newTask.title === "" || newTask.desc === "" ? false : true);
  }, [newTask]);
  // DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const onChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined
  ) => {
    if (selectedDate) {
      setnewTask({ ...newTask, due_date: selectedDate });
    }
    setShowDatePicker(false);
  };

  //Handle Task
  const handleTask = () => {
    if (modalType === "add") {
      addTask(newTask);
    } else {
      if (data) {
        editTask(data, newTask);
      }
    }
    setReReq(!reReq);
    setShowModal(false);
    setnewTask({
      title: "",
      desc: "",
      due_date: new Date(),
      status: "pending",
    });
  };
  return (
    <Modal
      isVisible={showModal}
      onBackdropPress={() => setShowModal(false)}
      swipeDirection={["down"]}
      onSwipeComplete={() => setShowModal(false)}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View
        style={{
          backgroundColor: "white",
          padding: 10,
          paddingTop: 30,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <View>
          <Text
            style={{
              fontWeight: "800",
              color: "#74b9ff",
              opacity: 0.8,
              paddingStart: 10,
            }}
          >
            TITLE
          </Text>
          <Input
            value={newTask.title}
            onChangeText={(txt) => setnewTask({ ...newTask, title: txt })}
          />
        </View>
        <View>
          <Text
            style={{
              fontWeight: "800",
              color: "#74b9ff",
              opacity: 0.8,
              paddingStart: 10,
            }}
          >
            DESCRIPTION
          </Text>
          <Input
            value={newTask.desc}
            onChangeText={(txt) => setnewTask({ ...newTask, desc: txt })}
          />
        </View>
        <View>
          <Text
            style={{
              fontWeight: "800",
              color: "#74b9ff",
              opacity: 0.8,
              paddingStart: 10,
            }}
          >
            DEADLINE
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Input
              value={newTask.due_date?.toString()?.slice(0, 10)}
              disabled={true}
              rightIcon={
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <OctiIcon name="calendar" size={25} color={"#74b9ff"} />
                </TouchableOpacity>
              }
            />
          </View>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: inputsCheck ? "#74b9ff" : "#95a5a6",
            padding: 20,
            borderRadius: 20,
          }}
          disabled={inputsCheck ? false : true}
          onPress={handleTask}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "800",
              textAlign: "center",
              fontSize: 18,
            }}
          >
            {modalType === "add" ? "Create Task" : "Update Task"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date(newTask.due_date)}
            onChange={onChange}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  b: {
    position: "absolute",
    bottom: 75,
    right: 20,
    width: 75,
    height: 75,
    borderRadius: 25,
    backgroundColor: "#0984e3",
    alignItems: "center",
    justifyContent: "center",
  },
});
