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
import NotFoundPage from "./pages/404";

function App() {
  const [array, setArray] = useState([]);

  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8888/api/users");
    console.log([response.data.users]);
    setArray([response.data.users]);
    // console.log(array);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

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
            <Route
              path="/accountsettings"
              element={<div>Account Settings Page</div>}
            />
            <Route path="/notfound" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
