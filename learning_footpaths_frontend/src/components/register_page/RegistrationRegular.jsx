import "../../css/App.css";
export default function RegistrationRegular() {
  return (
    <div>
      <form>
        <div>
          <input
            type="name"
            id="name"
            name="name"
            placeholder="Name"
            required
          />
        </div>
        <div>
          <select id="gradeLevel" name="gradeLevel" required>
            <option value="">Select Grade Level</option>
            <option value="kindergarten">Kindergarten</option>
            <option value="1">1st Grade</option>
            <option value="2">2nd Grade</option>
            <option value="3">3rd Grade</option>
            <option value="4">4th Grade</option>
            <option value="5">5th Grade</option>
            <option value="6">6th Grade</option>
            <option value="7">7th Grade</option>
            <option value="8">8th Grade</option>
            <option value="9">9th Grade</option>
            <option value="10">10th Grade</option>
            <option value="11">11th Grade</option>
            <option value="12">12th Grade</option>
          </select>
        </div>
        <div>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>
        <div>
          {/* make system to check if the password matches */}
          <input
            type="password"
            id="confirmpasswor"
            name="confirmpassword"
            placeholder="Confirm Password"
            required
          />
        </div>
        <button className="button" type="submit">
          Sign-Up
        </button>
      </form>
    </div>
  );
}
