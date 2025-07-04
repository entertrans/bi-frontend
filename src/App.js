// src/App.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./app/AppRouter";

function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
