import { Link } from "react-router";

const Navbar = ({ handleLogout, openAuthModal }) => {
  const userId = sessionStorage.getItem("user_id");

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-lg bg-body-tertiary rounded">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            MediaSurf
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                {userId === "" || userId === null ? (
                  <></>
                ) : (
                  <Link className="nav-link" to="/history">
                    History
                  </Link>
                )}
              </li>
              <li className="nav-item">
                {userId === "" || userId === null ? (
                  <button className="login-btn" onClick={openAuthModal}>
                    Login
                  </button>
                ) : (
                  <button className="login-btn " onClick={handleLogout}>
                    Sign Out
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
