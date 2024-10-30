import { useState } from "react";
import "./css/App.css";
import Header from "./components/Header";
import LandingPageComponent from "./components/landing_page/LandingPageComponent";
import ExhibitPageComponent from "./components/exhibitions_page/ExhibitionPageComponent";

function App() {
  // return
  return (
    <div>
      <Header />
      <LandingPageComponent />
      <ExhibitPageComponent />
    </div>
  );
}

export default App;
