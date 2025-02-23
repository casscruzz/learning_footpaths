import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./css/App.css";
import axios from "axios";
import LandingPageComponent from "./pages/LandingPageComponent";
import ExhibitPageComponent from "./pages/ExhibitionPageComponent";
import LoginPageComponent from "./pages/LoginPageComponent";
import RegistrationComponent from "./pages/RegistrationComponent";
import BadgesDisplayPage from "./pages/BadgesDisplayPage";
import MYOBPage from "./pages/MYOBPage";
import AccountPage from "./pages/AccountPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import NotFoundPage from "./pages/404";
import ExhibitionQuizPage from "./pages/ExhibitionQuizPage";
import NotAvailablePage from "./pages/NotAvailablePage";

function App() {
  const [array, setArray] = useState([]);

  // const fetchAPI = async () => {
  //   const response = await axios.get("http://localhost:8888/api/users");
  //   console.log([response.data.users]);
  //   setArray([response.data.users]);
  //   // console.log(array);
  // };

  // useEffect(() => {
  //   fetchAPI();
  // }, []);

  return (
    <div>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<RegistrationComponent />} />
            <Route path="/login" element={<LoginPageComponent />} />
            <Route path="/exhibitions" element={<ExhibitPageComponent />} />
            <Route path="/" element={<LandingPageComponent />} />
            <Route path="/badges" element={<BadgesDisplayPage />} />
            <Route path="/badgemaker" element={<MYOBPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/accountsettings" element={<AccountSettingsPage />} />
            <Route path="/notfound" element={<NotFoundPage />} />
            <Route path="/exhibition-quiz" element={<ExhibitionQuizPage />} />
            <Route path="/forgot-password" element={<NotAvailablePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
