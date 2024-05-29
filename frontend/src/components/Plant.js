import React from 'react';
import axios from 'axios';

const deletePlant = async (id) => {
    console.log(id);
    axios.get(`http://localhost:4000/api/deletePlant/${id}`)
    .then(
        function (response){
            alert(response.data.message);
        }
    )
    .catch(
        function (error){
            alert(error.message);
        }
    );
}

function Plant({ plants }) {
    return (
        <div>
            {plants.map((plant) => (
                <div key={plant._id}>
                    <img src={plant.imgURL} alt={plant.plantName} width="200" height="200"/>
                    <h2>{plant.plantName}</h2>
                    <p>Location: {plant.location}</p>
                    <p>Date Planted: {plant.datePlanted}</p>
                    <button onClick={() => deletePlant(plant._id)} className='btn'>Delete Plant</button>
                </div>
            ))}
        </div>
    );
}

export default Plant;
