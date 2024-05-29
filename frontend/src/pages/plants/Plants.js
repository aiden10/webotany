import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import PlantForm from "../../components/PlantForm";
import Plant from "../../components/Plant";

function Plants(){
    const { user, isLoading } = useAuth0();
    const [plants, setPlants] = useState([]);
    const [dataRetrieved, setDataRetrieved] = useState(false);

    useEffect( () => {
        if (!isLoading && user){
            axios.get(`http://localhost:4000/api/getUserPlants/${user.email}`)
            .then(function (response){
                setPlants(response);
                setDataRetrieved(true);
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
            <PlantForm />
            {dataRetrieved && <Plant plants={plants.data} />}
        </div>
    );
}

export default Plants;