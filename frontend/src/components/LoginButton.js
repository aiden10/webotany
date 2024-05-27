import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
    if (!isAuthenticated && !isLoading){
      return (
        <div>
          <button className="btn" onClick={() => loginWithRedirect()}>Log In</button>
        </div>
      );
    }
  };
  
  export default LoginButton;