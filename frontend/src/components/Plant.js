import React from 'react';

function Plant({ plants, deletePlant }) {
    return (
        <div>
            {plants.map((plant) => (
                <div key={plant._id}>
                    <img src={plant.imgURL} alt={plant.plantName} width="200" height="200"/>
                    <h2>{plant.plantName}</h2>
                    <p>Location: {plant.location}</p>
                    <p>Date Planted: {plant.datePlanted.split("T")[0]}</p>
                    <button onClick={() => deletePlant(plant._id)} className='btn'>Delete Plant</button>
                </div>
            ))}
        </div>
    );
}

export default Plant;

