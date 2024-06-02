import React, {useState} from 'react'
import AsyncSelect from 'react-select/async';
import axios from 'axios';

const getToken = async () => {
    try {
        const response = await axios.get('http://localhost:4000/api/getCertificate');
        console.log(response.data.token);
        return response.data.token;
    }
    catch (error){
        console.error('Error fetching plant data: ', error);
        return '';
    }
}

const filterPlants = async (inputValue) => {
    // calls plant api and filters results
    const trefle_token = await getToken();  
    if (trefle_token !== ''){
        try {
            const response = await axios.get(`https://trefle.io/api/v1/plants/search?token=${trefle_token}&q=${inputValue}`);
            return response.data.data.map((plant) => ({
                label: plant.common_name,
                value: plant.slug,   
            }))
        }
        catch (error){
            console.error('Error fetching plant data: ', error);
            return [];
        }    
    }
    else{
        return [];
    }
}

const loadOptions = (inputValue, callback) => {
    if (inputValue.length > 4){
        filterPlants(inputValue).then((options) => {
            callback(options);
        });    
    }
}

function DropdownSearch({ onSelectPlant }){
    const handleChange = (selectedOption) => {
        onSelectPlant(selectedOption);
    }

    return(
        <div>
            <AsyncSelect cacheOptions
             loadOptions={loadOptions}
             defaultOptions 
             onChange={handleChange}
             placeholder="Search here..."/>

        </div>
    );
}

export default DropdownSearch;