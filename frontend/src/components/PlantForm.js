import React, { useState } from 'react';
import DropdownSearch from "./DropdownSearch";
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

function PlantForm() {
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [textField, setTextField] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth0();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedPlant || !textField) {
            setError('All fields are required.');
            return;
        }

        setError('');
        setTextField('');
        
        try {
            const response = await axios.post('http://localhost:4000/api/addPlant', {
                plantName: selectedPlant.label,
                owner: user.email, 
                location: textField,
            });
            console.log('Plant added successfully:', response.data);
        } catch (error) {
            console.error('Error adding plant:', error);
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
                    Location:
                    <input
                        type="text"
                        value={textField}
                        onChange={(e) => setTextField(e.target.value)}
                        required
                    />
                </label>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Submit</button>
        </form>
    );
}
export default PlantForm;