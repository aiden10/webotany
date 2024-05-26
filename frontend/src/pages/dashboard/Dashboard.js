import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function Dashboard(){
    const { user, isAuthenticated, isLoading } = useAuth0();
    console.log(isAuthenticated)
    if (isLoading) {
        return <div>Loading ...</div>;
    }

    if (!isLoading && !isAuthenticated){
        return (
            <div>
                <p>Must be logged in</p>
            </div>
        );
    }

    return (
        isAuthenticated && (
        <div>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
        )
    );
}

export default Dashboard;