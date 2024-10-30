import { useState } from "react";
import "./css/App.css";
import Header from "./components/Header";
import LandingPageComponent from "./components/landing_page/LandingPageComponent";
import ExhibitPageComponent from "./components/exhibitions_page/ExhibitionPageComponent";
import LoginPageComponent from "./components/login_page/LoginPageComponent";
import RegistrationComponent from "./components/register_page/RegistrationComponent";
function App() {
  // return
  return (
    <div>
      <Header />
      <LandingPageComponent />
      <ExhibitPageComponent />
      <LoginPageComponent />
      <RegistrationComponent />
    </div>
  );
}

export default App;
