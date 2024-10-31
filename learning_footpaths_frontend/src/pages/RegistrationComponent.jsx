import RegistrationAlternative from "../components/register_page/RegistrationAlternative";
import RegistrationRegular from "../components/register_page/RegistrationRegular";
import Header from "../components/Header";

export default function RegistrationComponent() {
  return (
    <div>
      <Header />
      <h1>Registration Page</h1>
      <RegistrationAlternative />
      <RegistrationRegular />
      <p>
        Already have an account? <a href="/login">Login here.</a>
      </p>{" "}
    </div>
  );
}
