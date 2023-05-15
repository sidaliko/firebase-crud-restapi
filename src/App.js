import NavBar from "./component/NavBar";
import Clients from "./component/Clients";
import Products from "./component/Products";
import Invoices from "./component/Invoices";
// import InvLignes from "./component/InvLignes";
import SignIn from "./component/SignIn";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase/auth";
import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [activeItem, setActiveItem] = useState("");
  const [sign, setSign] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showBackground, setShowBackground] = useState(true); // new state variable

  useEffect(() => {
    const authToken = localStorage.getItem("user");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleItemClick = (item) => {
    setActiveItem(item);
    setShowBackground(false);
    if (item === "LogOut") {
      const confirmLogOut = window.confirm("Are you sure to log out");
      if (confirmLogOut) {
        signOut(auth)
          .then(() => {
            localStorage.removeItem("user");
            setSign(false);
            setIsLoggedIn(false);
            // Sign-out successful.
          })
          .catch((error) => {
            // An error happened.
          });
      } else {
        setShowBackground(true);
      }
    }
  };

  const handleSignIn = () => {
    setSign(true);
    setShowBackground(true); // set the state to true after signing in
  };

  return (
    <>
      <CssBaseline />
      {isLoggedIn || sign ? (
        <>
          {/* Render the Bar component with background image conditionally */}
          {showBackground && (
            <div className="showback">
              <NavBar onItemClick={handleItemClick} />
            </div>
          )}
          {!showBackground && <NavBar onItemClick={handleItemClick} />}
          {/* Render the appropriate component based on the activeItem state */}
          {activeItem === "Client" && <Clients />}
          {activeItem === "Product" && <Products />}
          {activeItem === "Invoice" && <Invoices />}
        </>
      ) : (
        <SignIn
          onSignIn={handleSignIn}
          setSign={setSign}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </>
  );
}

export default App;
