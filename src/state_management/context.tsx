import React, { createContext, useState } from "react";
import { TaskType, UserType } from "./context_provider";

const Context = createContext({
  tasks: [],
  setTasks: () => {},
  addTask: (item: TaskType) => {},
  removeTask: (item: TaskType) => {},
  users: [],
  setUsers: () => {},
  myTasks: [],
  addUser: (item: UserType) => {},
  userId: "",
  setUserId: (item: string) => {},
  onload: () => {},
  eraseData: () => {},
});

export default Context;
