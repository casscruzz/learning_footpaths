import RegistrationAlternative from "./RegistrationAlternative";
import RegistrationRegular from "./RegistrationRegular";

export default function RegistrationComponent() {
  return (
    <div>
      <h1>Registration Page</h1>
      <RegistrationAlternative />
      <RegistrationRegular />
      <p>
        Already have an account? <a href="/login">Login here.</a>
      </p>{" "}
    </div>
  );
}
