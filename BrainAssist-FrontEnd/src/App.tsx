import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Button } from "./components/ui/Button";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Button
        loading={false}
        variant="primary"
        text="Signin"
        fullWidth={true}
      />
    </>
  );
}

export default App;
