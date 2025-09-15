import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/Content.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  //<React.StrictMode>
    <div className="content"><App /></div>
  //</React.StrictMode>
);
