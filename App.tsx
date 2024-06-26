import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigations from "./src/navigation/navigation";
import Provider from "./src/state_management/context_provider";

function App() {
  return (
    <SafeAreaProvider>
      <Provider>
        <Navigations />
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
