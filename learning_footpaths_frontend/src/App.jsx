import { useState } from "react";
import "./css/App.css";
import Header from "./components/Header";
import LandingPageText from "./components/LandingPageText";
import FootpathCards from "./components/FootpathCards";

function App() {
  // return
  return (
    <div>
      <Header />
      <LandingPageText />
      <FootpathCards />
    </div>
  );
}

export default App;
