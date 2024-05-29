import React, { useState } from 'react';
import DropdownSearch from "./DropdownSearch";
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

function PlantForm() {
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [locationField, setlocationField] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth0();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedPlant || !locationField) {
            setError('A plant is required.');
            return;
        }

        setError('');
        setlocationField('');
        
        try {
            const response = await axios.post('http://localhost:4000/api/addPlant', {
                plantName: selectedPlant.label,
                owner: user.email, 
                location: locationField,
            });
            alert(response.data.message);
        } catch (error) {
            alert(error.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Select Plant:
                    <DropdownSearch onSelectPlant={setSelectedPlant} />
                </label>
            </div>
            <div>
                <label>
                    Location (Optional):
                    <input
                        type="text"
                        value={locationField}
                        onChange={(e) => setlocationField(e.target.value)}
                    />
                </label>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" className='btn'>Submit</button>
        </form>
    );
}
export default PlantForm;