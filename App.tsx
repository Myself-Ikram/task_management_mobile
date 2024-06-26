import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigations from "./src/navigation/navigation";

function App() {
  return (
    <SafeAreaProvider>
      <Navigations />
    </SafeAreaProvider>
  );
}

export default App;
