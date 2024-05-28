import React from 'react';

function Plant({ plants }) {
    return (
        <div>
            {plants.map((plant) => (
                <div key={plant._id}>
                    <img src={plant.imgURL} alt={plant.plantName} />
                    <h2>{plant.plantName}</h2>
                    <p>Location: {plant.location}</p>
                    <p>Date Planted: {plant.datePlanted}</p>
                </div>
            ))}
        </div>
    );
}

export default Plant;
