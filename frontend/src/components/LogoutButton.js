import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout, isAuthenticated, isLoading } = useAuth0();
  if (isAuthenticated && !isLoading){
    return (
      <button className="btn" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log Out
      </button>
    );
  }
};

export default LogoutButton;