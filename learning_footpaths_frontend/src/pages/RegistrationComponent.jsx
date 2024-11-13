import { useState } from "react";
import RegistrationAlternative from "../components/register_page/RegistrationAlternative";
// import RegistrationRegular from "../components/register_page/RegistrationRegular";
import Header from "../components/Header";
import httpClient from "../httpClient"; // Assuming httpClient is imported from somewhere

export default function RegistrationComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    try {
      const resp = await httpClient.post("http://localhost:8888/register", {
        email,
        password,
      });
      if (resp.status === 200) {
        window.location.href = "/";
      }
    } catch (e) {
      if (e.response && e.response.status === 401) {
        alert("Invalid email or password");
      }
      return;
    }
  };

  return (
    <div>
      <Header />
      <h1>Registration Page</h1>
      <RegistrationAlternative />
      {/* <RegistrationRegular /> */}
      <div>
        <h1>Create an Account (Regular for Testing)</h1>
        <form>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={registerUser}>
            Register User
          </button>
        </form>
        <p>
          Already have an account? <a href="/login">Login here.</a>
        </p>
      </div>
    </div>
  );
}
