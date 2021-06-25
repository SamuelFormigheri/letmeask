import { RootProvider } from "./contexts/rootProvider";
import { Routes } from "./routes";

function App() {
  return (
    <RootProvider>
      <Routes />
    </RootProvider>
  );
}

export default App;
