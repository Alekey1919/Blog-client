import React, { useContext } from "react";
import "../Styles/Css/Styles.css";
import * as ReactBootStrap from "react-bootstrap";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { UserContext } from "../Helper/UserContext";
import { useNavigate } from "react-router";

function Navbar() {
  // User auth

  const { userData, setUserData } = useContext(UserContext);

  const handleAuthentication = (e) => {
    e.preventDefault();
    if (userData && window.confirm("¿Are you sure you want to log out?")) {
      signOut(auth);
      localStorage.removeItem("user");
      setUserData(false);
    }
  };

  const navigate = useNavigate();

  const search = (e) => {
    e.preventDefault();
    const input = document.getElementById("navbar-searchbar").value;

    if (input) {
      navigate(`/search/${input}`);
    } else {
      return;
    }
  };

  return (
    <ReactBootStrap.Navbar expand="lg" id="navbar-container">
      <Link to="/" className="router-link">
        <h1 id="logo">Blog</h1>
      </Link>
      <ReactBootStrap.Navbar.Toggle
        aria-controls="navbarScroll"
        id="hamburguer"
      />
      <ReactBootStrap.Navbar.Collapse id="navbarScroll">
        <ReactBootStrap.Nav
          className="mr-auto my-2 my-lg-0 flex nav-buttons-section"
          navbarScroll
        >
          <hr className="navbar-hr" />
          <Link to="/write-blog" className="router-link">
            <i className="fas fa-pen write-blog" title="Write a blog"></i>
          </Link>
          <div className="search-box-container">
            <ReactBootStrap.Form className="d-flex" id="search-bar">
              <ReactBootStrap.FormControl
                type="search"
                placeholder="Search"
                className="mr-2 success navbar-input"
                id="navbar-searchbar"
                aria-label="Search"
              />
              <button id="navbar-search-btn" onClick={(e) => search(e)}>
                <i className="fas fa-search"></i>
              </button>
            </ReactBootStrap.Form>
          </div>
          {userData ? (
            <div className="dropdown-container">
              <img
                src={userData.image}
                alt="User"
                className="navbar-user-img"
              />
              <ReactBootStrap.NavDropdown
                title={userData.nickname}
                id="navbarScrollingDropdown"
              >
                <Link
                  to={`/Profile/${userData.nickname}`}
                  className="router-link dropdown-item"
                >
                  Profile
                </Link>
                <Link to="#" className="router-link dropdown-item">
                  My blogs
                </Link>
                <Link to="#" className="router-link dropdown-item ">
                  Favourites
                </Link>
                <Link
                  to=""
                  className="router-link dropdown-item"
                  onClick={handleAuthentication}
                >
                  Logout
                </Link>
              </ReactBootStrap.NavDropdown>
            </div>
          ) : (
            <Link to="/login" className="router-link">
              Login
            </Link>
          )}
        </ReactBootStrap.Nav>
      </ReactBootStrap.Navbar.Collapse>
    </ReactBootStrap.Navbar>
  );
}

export default Navbar;
