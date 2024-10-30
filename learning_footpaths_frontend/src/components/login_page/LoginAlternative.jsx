import "../../css/App.css";
export default function LoginAlternative() {
  return (
    <div>
      <h1>Log-in Alternative</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button className="button" style={{ marginBottom: "10px" }}>
          Continue with Google
        </button>
        <button className="button">Continue with Facebook</button>
      </div>
    </div>
  );
}