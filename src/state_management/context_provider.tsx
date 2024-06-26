import React, { useEffect, useState } from "react";
import TaskContext from "./context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TaskType = {
  title: string;
  desc: string;
  due_date: string;
  status: "completed" | "pending";
};
export type UserType = {
  email: string;
  password: string;
};

// @ts-ignore
const Provider = ({ children }) => {
  // User context
  const [users, setUsers] = useState<UserType[]>([]);
  const addUser = async (newUser: UserType) => {
    if (users) {
      const newArray = [...users, newUser];
      setUsers(newArray);
      await AsyncStorage.setItem("users", JSON.stringify(newArray));
    }
  };
  const removeUser = (user: UserType) => {
    console.log("Hello");
    // setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Task context
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const addTask = (newTask: TaskType) => {
    if (tasks) {
      setTasks([...tasks, newTask]);
    }
  };
  const removeTask = (taskId: TaskType) => {
    console.log("Hello");
    // setTasks(tasks.filter((task) => task.id !== taskId));
  };

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem("users");
      if (userData) {
        setUsers(JSON.parse(userData));
      }
    })();
  }, []);
  return (
    <TaskContext.Provider
      value={{
        // @ts-ignore
        users,
        addUser,
        removeUser,
        // @ts-ignore
        tasks,
        addTask,
        removeTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default Provider;
