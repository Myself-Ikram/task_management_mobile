import React, { useEffect, useState } from "react";
import TaskContext from "./context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TaskType = {
  title: string;
  desc: string;
  due_date: string | Date;
  status: "completed" | "pending";
  userId?: string;
};
export type UserType = {
  email: string;
  password: string;
};

// @ts-ignore
const Provider = ({ children }) => {
  // UserId
  const [userId, setUserId] = useState<string>();
  // User context
  const [users, setUsers] = useState<UserType[]>([]);
  const addUser = async (newUser: UserType) => {
    if (users) {
      const newArray = [...users, newUser];
      setUsers(newArray);
      await AsyncStorage.setItem("users", JSON.stringify(newArray));
    }
  };

  // Task context
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [myTasks, setMyTasks] = useState<TaskType[]>([]);
  const addTask = async (newTask: TaskType) => {
    if (tasks && userId) {
      const newArray = [...tasks, { ...newTask, userId }];
      setTasks(newArray);
      setMyTasks([...myTasks, { ...newTask, userId }]);
      await AsyncStorage.setItem("tasks", JSON.stringify(newArray));
    }
  };
  const changeTaskStatus = async (taskObj: TaskType) => {
    const newArray: TaskType[] = tasks?.map((t) =>
      t === taskObj
        ? { ...t, status: t?.status === "pending" ? "completed" : "pending" }
        : t
    );
    setTasks(newArray);
    setMyTasks(
      myTasks?.map((t) =>
        t === taskObj
          ? { ...t, status: t?.status === "pending" ? "completed" : "pending" }
          : t
      )
    );
    await AsyncStorage.setItem("tasks", JSON.stringify(newArray));
  };
  const editTask = async (taskObj: TaskType, updateObj: TaskType) => {
    const newArray = tasks?.map((t) => (t === taskObj ? updateObj : t));
    setTasks(newArray);
    setMyTasks(myTasks?.map((t) => (t === taskObj ? updateObj : t)));
    await AsyncStorage.setItem("tasks", JSON.stringify(newArray));
  };
  const removeTask = async (taskObj: TaskType) => {
    const newArray = tasks.filter((t) => t !== taskObj);
    setTasks(newArray);
    setMyTasks(myTasks.filter((t) => t !== taskObj));
    await AsyncStorage.setItem("tasks", JSON.stringify(newArray));
  };
  const onload = async () => {
    const userData = await AsyncStorage.getItem("users");
    if (userData) {
      setUsers(JSON.parse(userData));
    }
    const userId = await AsyncStorage.getItem("email");
    if (userId) {
      setUserId(userId);
    }
    const taskData = await AsyncStorage.getItem("tasks");
    if (taskData) {
      const parsedData = JSON.parse(taskData);
      setTasks(parsedData);
    }
  };
  const getMyTask = () => {
    setMyTasks(tasks?.filter((i: TaskType) => i?.userId === userId));
  };

  // Remove all data
  const eraseData = async () => {
    await AsyncStorage.multiRemove(["users", "tasks"]);
    setUsers([]);
    setTasks([]);
    setMyTasks([]);
  };
  return (
    <TaskContext.Provider
      value={{
        // @ts-ignore
        users,
        addUser,
        // @ts-ignore
        tasks,
        // @ts-ignore
        addTask,
        changeTaskStatus,
        removeTask,
        editTask,
        // @ts-ignore
        userId,
        // @ts-ignore
        myTasks,
        setUserId,
        onload,
        getMyTask,
        eraseData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default Provider;
