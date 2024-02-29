import "./App.css";

import { BrowserRouter, Route, Link, Router, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import Debug from "./components/Debug";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="" element={<Landing />} />
        <Route path="debug" element={<Debug />} />
      </Routes>
    </div>
  );
}

export default App;
