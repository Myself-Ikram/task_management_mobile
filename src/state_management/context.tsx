import React, { createContext, useState } from "react";
import { TaskType, UserType } from "./context_provider";

const Context = createContext({
  tasks: [],
  setTasks: () => {},
  addTask: (item: TaskType) => {},
  changeTaskStatus: (item: TaskType) => {},
  removeTask: (item: TaskType) => {},
  editTask: (item1: TaskType, item2: TaskType) => {},
  users: [],
  setUsers: () => {},
  myTasks: [],
  addUser: (item: UserType) => {},
  userId: "",
  setUserId: (item: string) => {},
  onload: () => {},
  getMyTask: () => {},
  eraseData: () => {},
});

export default Context;
