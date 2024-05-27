import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../../components/LoginButton";
import LogoutButton from "../../components/LogoutButton";
import { useNavigate } from "react-router-dom";

function Homepage(){
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth0();

    return(
        <div>
            <LoginButton/>
            <LogoutButton/>
            { isAuthenticated && !isLoading &&
                <>
                    <button onClick={() => navigate("/profile")} className="btn">View Profile</button>
                    <button onClick={() => navigate("/plants")} className="btn">View Plants</button>
                </>
            }
        </div>
    );
}

export default Homepage;