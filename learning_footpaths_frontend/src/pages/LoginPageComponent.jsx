import LoginAlternative from "../components/login_page/LoginAlternative";
import LoginRegular from "../components/login_page/LoginRegular";
import Header from "../components/Header";

export default function LoginPageComponent() {
  return (
    <div>
      <Header />
      <h1>Log-in Page</h1>

      <LoginAlternative />
      <LoginRegular />
    </div>
  );
}
