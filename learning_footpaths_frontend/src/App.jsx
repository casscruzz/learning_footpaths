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
      {/* Testing Out the API Call from Flask */}
      {/* <div>
        <h1>Testing out the API Call from Flask</h1>
        <p>
          {array.map((user, index) => {
            return <span key={index}>{user}</span>;
          })}
        </p>
      </div> */}

      {/* Testing out the Browser Router */}
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<RegistrationComponent />} />
            <Route path="/login" element={<LoginPageComponent />} />
            <Route path="/exhibitions" element={<ExhibitPageComponent />} />
            <Route path="/" element={<LandingPageComponent />} />
            <Route path="/badges" element={<BadgesDisplayPage />} />
            <Route path="/badgemaker" element={<MYOBPage />} />
            <Route path="/account" element={<div>Account Page</div>} />
            <Route
              path="/accountsettings"
              element={<div>Account Settings Page</div>}
            />
          </Routes>
        </BrowserRouter>
      </div>
      {/* <Header />
      <LandingPageComponent />
      <ExhibitPageComponent />
      <LoginPageComponent />
      <RegistrationComponent /> */}
    </div>
  );
}

export default App;
