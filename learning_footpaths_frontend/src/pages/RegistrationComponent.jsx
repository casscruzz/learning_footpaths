// import Header from "../components/Header";
// import React, { useState } from "react";
// import axios from "axios";
// import "../css/App.css";
// import styles from "../css/login_page/LoginPage.module.css";
// import { useNavigate } from "react-router-dom";

// export default function RegisterPageComponent() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [error, setError] = useState(null);

//   const navigate = useNavigate();

//   // const registerUser = async () => {
//   //   try {
//   //     const quiz_session_id = sessionStorage.getItem("quiz_session_id");

//   //     const resp = await axios.post(
//   //       "http://localhost:8888/register",
//   //       {
//   //         email,
//   //         password,
//   //         quiz_session_id,
//   //       },
//   //       {
//   //         withCredentials: true,
//   //       }
//   //     );
//   //     console.log("Registered footpath name:", resp.data.footpath_name);

//   //     if (resp.status === 201) {
//   //       // Use 201 status from your backend
//   //       // Clear the session ID
//   //       sessionStorage.removeItem("quiz_session_id");

//   //       // Navigate based on response
//   //       if (resp.data.footpath_id) {
//   //         navigate("/exhibitions", {
//   //           state: { selectedFootpath: resp.data.footpath_name },
//   //         });
//   //       } else {
//   //         navigate("/");
//   //       }
//   //     }
//   //   } catch (error) {
//   //     if (error.response?.status === 409) {
//   //       alert("User already exists");
//   //     } else {
//   //       setError("Registration failed. Please try again.");
//   //     }
//   //     console.error("Registration error:", error);
//   //   }
//   // };
//   const registerUser = async () => {
//     try {
//       const quiz_session_id = sessionStorage.getItem("quiz_session_id");
//       const returnFootpath = sessionStorage.getItem("returnFootpath");

//       const resp = await axios.post(
//         "http://localhost:8888/register", // Fix URL
//         {
//           email,
//           password,
//           quiz_session_id,
//         },
//         { withCredentials: true }
//       );

//       sessionStorage.removeItem("quiz_session_id");
//       sessionStorage.removeItem("returnFootpath");

//       if (returnFootpath) {
//         navigate("/exhibitions", {
//           state: { selectedFootpath: returnFootpath },
//         });
//       } else {
//         navigate("/");
//       }
//     } catch (error) {
//       if (error.response?.status === 409) {
//         alert("User already exists");
//       } else {
//         setError("Registration failed. Please try again.");
//       }
//       console.error("Registration error:", error);
//     }
//   };
//   return (
//     <div>
//       <Header />
//       <div className={styles.loginContainer}>
//         <h1 style={{ textAlign: "center" }}>Register</h1>
//         <div>
//           <h2 style={{ textAlign: "center" }}>Create an account</h2>
//           {/* <form className={styles.loginForm}> */}
//           <form
//             className={styles.loginForm}
//             onSubmit={(e) => {
//               e.preventDefault();
//               registerUser();
//             }}
//           >
//             <div>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 placeholder="email"
//                 onChange={(e) => setEmail(e.target.value)}
//                 className={styles.loginInput}
//                 required
//               />
//             </div>
//             <div>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 placeholder="password"
//                 onChange={(e) => setPassword(e.target.value)}
//                 className={styles.loginInput}
//                 required
//               />
//             </div>
//             <button className="button" type="submit">
//               Register
//             </button>
//           </form>
//           <p style={{ textAlign: "center", fontSize: "12px", color: "grey" }}>
//             Already have an account? <a href="/login">Login Now.</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import styles from "../css/register_page/RegisterPage.module.css";

export default function RegisterPageComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      const quiz_session_id = sessionStorage.getItem("quiz_session_id");
      const returnFootpath = sessionStorage.getItem("returnFootpath");

      const resp = await axios.post(
        "http://localhost:8888/register",
        {
          email,
          password,
          quiz_session_id,
        },
        { withCredentials: true }
      );

      // Clear session storage after successful registration
      sessionStorage.removeItem("quiz_session_id");
      sessionStorage.removeItem("returnFootpath");

      if (resp.data.footpath_name) {
        navigate("/exhibitions", {
          state: { selectedFootpath: resp.data.footpath_name },
        });
      } else if (returnFootpath) {
        navigate("/exhibitions", {
          state: { selectedFootpath: returnFootpath },
        });
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        alert("User already exists");
      } else {
        setError("Registration failed. Please try again.");
      }
      console.error("Registration error:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.registrationContainer}>
        <h1 className={styles.title}>
          We're glad to have you here. Let's{" "}
          <span className={styles.blueText}>create your account</span>!
        </h1>

        <h2 className={styles.subtitle}>
          Enter your email and desired password
        </h2>

        <form
          className={styles.registrationForm}
          onSubmit={(e) => {
            e.preventDefault();
            registerUser();
          }}
        >
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.registrationInput}
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.registrationInput}
            required
          />
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.registerButton}>
            Log-in
          </button>
        </form>
        <div className={styles.loginLink}>
          <a href="/login">Already have an account? Log-in here instead.</a>
        </div>
      </div>
    </div>
  );
}
