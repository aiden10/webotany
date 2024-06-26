import axios from "axios";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

function AddPlant(name, owner, location){
    
    axios.post('http://localhost:4000/api/addPlant', {
        plantName: name,
        owner: owner,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });        
}

function AddPlantButton(){
    const { user } = useAuth0();
    const [plantName, setPlantName] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e)=> {
        e.preventDefault();
        if (user){
            AddPlant(plantName, user.email, location);
            alert('Plant added');
            setPlantName('');
            setLocation('');
        }
        else{
            alert('Must be logged in');
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="plantName" className="form-label">Plant Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="plantName" 
                        value={plantName} 
                        onChange={(e) => setPlantName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="location" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default AddPlantButton;