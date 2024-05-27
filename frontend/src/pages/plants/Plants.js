import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect } from "react";
import AddPlantButton from "../../components/AddPlantButton";

function Plants(){
    const { user, isLoading } = useAuth0();
    
    useEffect( () => {
        if (!isLoading && user){
            const today = new Date().toISOString();
            axios.get('http://localhost:4000/api/getUserPlants/' + user.email)
            .then(function (response){
                console.log(response)
            })
            .catch(function (error){
                console.log(error)
            })
        }
    }, [isLoading, user]); // call when isLoading and user update

    if (isLoading){
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    }

    return(
        <div>
            <p>Plants</p>
            <AddPlantButton />
        </div>
    );
}

export default Plants;