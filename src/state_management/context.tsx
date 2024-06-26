import React, { createContext, useState } from "react";
import { TaskType, UserType } from "./context_provider";

const Context = createContext({
  tasks: [],
  setTasks: () => {},
  addTask: (item: TaskType) => {},
  removeTask: (item: TaskType) => {},
  users: [],
  setUsers: () => {},
  addUser: (item: UserType) => {},
  removeUser: (item: UserType) => {},
});

export default Context;
