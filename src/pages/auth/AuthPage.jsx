import { useState } from "react";
import UserLogin from "./UserLogin";
import UserRegister from "./UserRegister";
import { Modal, ModalBody } from "react-bootstrap";

const AuthPage = ({ show, handleClose }) => {
  const [activeComponent, setActiveComponent] = useState("login");

  return (
    <Modal show={show} onHide={handleClose}>
      <ModalBody>
        <div className="container p-3 text-center">
          <h2 className="text-center">MediaSurf</h2>

          <div className=" container d-flex justify-content-center py-5">
            <button
              className={`btn btn-outline-dark auth-btn px-5 me-2 ${
                activeComponent === "login" ? "active" : ""
              }`}
              onClick={() => setActiveComponent("login")}
            >
              Login
            </button>
            <button
              className={`btn btn-outline-dark auth-btn px-5 ms-2 ${
                activeComponent === "register" ? "active" : ""
              }`}
              onClick={() => setActiveComponent("register")}
            >
              Register
            </button>
          </div>
          {activeComponent === "login" ? (
            <UserLogin handleClose={handleClose} />
          ) : (
            <UserRegister handleClose={handleClose} />
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AuthPage;
