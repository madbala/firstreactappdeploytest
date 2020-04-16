import React, { useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
import "leaflet/dist/leaflet.css";
// import "./styles.css";
import SampleComponent from "./App1.js";

function App() {
  const [name, setName] = useState("Bala");
  const [Nname, setnName] = useState("");

  function handleName(e) {
    setName(e.target.value);
  }
  function changeName() {
    // debugger;
    setnName(name);
  }
  return (
    <div className="App">
      {/* <header>Balaguru.R</header>
      <input type="text" value={name} onChange={handleName} />
      <input type="text" value={name} onChange={handleName} />
      <button className="btn btn-secondary" onClick={changeName}>
        Click Me
      </button> */}
      <SampleComponent />

      <div>"hi in App"</div>
    </div>
  );
}

export default App;
