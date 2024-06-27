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
      await AsyncStorage.setItem("tasks", JSON.stringify(newArray));
    }
  };
  // const addTask = async (newTask: TaskType) => {
  //   if (tasks) {
  //     const newArray = [...tasks, newTask];
  //     setTasks(newArray);
  //     await AsyncStorage.setItem("tasks", JSON.stringify(newArray));
  //   }
  // };
  const removeTask = (taskId: TaskType) => {
    console.log("Hello");
    // setTasks(tasks.filter((task) => task.id !== taskId));
  };
  const onload = async () => {
    const userData = await AsyncStorage.getItem("users");
    if (userData) {
      setUsers(JSON.parse(userData));
    }
    const taskData = await AsyncStorage.getItem("tasks");
    if (taskData) {
      const parsedData = JSON.parse(taskData);
      setTasks(parsedData);
      setMyTasks(tasks?.filter((i: TaskType) => i?.userId === userId));
    }
    const userId = await AsyncStorage.getItem("email");
    if (userId) {
      setUserId(userId);
    }
  };

  // Remove all data
  const eraseData = async () => {
    await AsyncStorage.multiRemove(["users", "tasks"]);
    setUsers([]);
    setTasks([]);
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
        removeTask,
        // @ts-ignore
        userId,
        // @ts-ignore
        myTasks,
        setUserId,
        onload,
        eraseData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default Provider;
