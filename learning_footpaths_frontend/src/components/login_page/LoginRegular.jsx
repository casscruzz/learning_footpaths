export default function LoginRegular() {
  return (
    <div>
      <h1>Log-in Regular</h1>
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
        <div>
          <a href="/forgot-password">Forgot password?</a>
        </div>
        <button className="button" type="submit">
          Log In
        </button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register Now.</a>
      </p>
    </div>
  );
}
