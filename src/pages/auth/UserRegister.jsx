import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { Toast, ToastContainer, Spinner } from "react-bootstrap";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const UserRegister = ({ handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSignUp = async () => {
    if (password !== repeatPassword) {
      setToastMessage("Passwords do not match");
      setIsError(true);
      setShowToast(true);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://mediasurfv1.vercel.app",
      },
    });

    if (error) {
      setToastMessage("Sign-up error: " + error.message);
      setIsError(true);
    } else if (
      data.user.aud === "authenticated" &&
      data.user.user_metadata.email_verified === false
    ) {
      setToastMessage(
        "Sign-up successful! Please check your email for confirmation."
      );
      setIsError(false);
      // sessionStorage.setItem("user_id", data.user.id);
      // setTimeout(handleClose(), 4000);
      // handleClose();
    } else {
      setToastMessage("No user data returned from Supabase");
      setIsError(true);
    }
    console.log(data);
    setLoading(false);
    setShowToast(true);
  };

  return (
    <div className="container">
      <ToastContainer position="top-center" className="p-3">
        <Toast
          bg={isError ? "danger" : "success"}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="d-flex justify-content-center">
        <div className="auth-form">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Repeat Password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
        </div>
      </div>
      <button
        className="btn btn-dark"
        onClick={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <span>Sign Up</span>
        )}
      </button>
    </div>
  );
};

export default UserRegister;
