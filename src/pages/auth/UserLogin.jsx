import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Toast, ToastContainer, Spinner } from "react-bootstrap";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const UserLogin = ({ handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setToastMessage("Login error: " + error.message);
      setIsError(true);
    } else if (data && data.user) {
      setToastMessage("Login successful!");
      setIsError(false);
      sessionStorage.setItem("user_id", data.user.id);
      setTimeout(() => navigate("/"), 2000);
      handleClose();
    } else {
      setToastMessage("No user data returned from Supabase");
      setIsError(true);
    }
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
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          <button
            className="btn btn-dark"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
