const express = require('express');
const Plant = require('../models/plant'); // this seems to work the same as a db object  
const axios = require('axios');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const router = express.Router()
const TOKEN = process.env.TREFLE_TOKEN;

const getPlantImage = async (plant) => {
    try {
        const response = await axios({
            method: 'get',
            url: `https://trefle.io/api/v1/plants/search?token=${TOKEN}&q=${plant}`,
        });
        if (response.data && response.data.data && response.data.data.length > 0) {
            return response.data.data[0].image_url;
        } else {
            throw new Error('No plant found');
        }
    } catch (error) {
        console.error('Error fetching plant image:', error);
        throw error;
    }
}

const getCertificate = async() => {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://trefle.io/api/auth/claim',
            headers: {'Content-Type': 'application/json'},
            params: {
                origin: 'http://localhost:3000',
                token: TOKEN
            }
        });
        return response.data.token;
    } 
    catch (error) {
        console.error(error);
        throw error;
    }
}
  
router.get('/getUserPlants/:email', async (req, res) => {
    try {
        const plants = await Plant.find({owner: req.params.email}); // get plants with user's email 
        res.setHeader('Content-Type', 'application/json');
        res.json(plants)
    }
    catch (error){
        res.status(500).json({message: error.message})
    }
});

router.get('/deletePlant/:id', async (req, res) => {
    const plantID = req.params.id;
    const objectId = new ObjectId(plantID); // Convert the string to ObjectId
    try {
        const result = await Plant.deleteOne({_id: objectId});

        if (result.deletedCount === 0){
            return res.status(404).json({ message: 'Plant not found or already deleted' });
        }

        res.status(200).json({message: 'Plant successfully deleted'});
    }
    catch (error){
        console.error(error);
        res.status(500).json({message: error.message});
        throw error;
    }
});

router.post('/addPlant', async (req, res) => {
    try {
        const plantImg = await getPlantImage(req.body.plantName);
        const newPlant = new Plant({
            plantName: req.body.plantName,
            owner: req.body.owner,
            location: req.body.location || '',
            imgURL: plantImg || 'https://hips.hearstapps.com/hmg-prod/images/sansevieria-royalty-free-image-1642793822.jpg?crop=1xw:0.99987xh;center,top&resize=980:*',
            daysSinceRain: 0
        });
        await newPlant.save();
        res.status(201).json({ message: 'Plant created successfully' });
    } catch (err) {
        console.error('Error adding plant:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

router.get('/getCertificate', async (req, res) => {
    try {
        const certificate = await getCertificate();
        return res.json({token: certificate});
    }
    catch (error){
        res.status(500).json({message: error.message})
    }
});

module.exports = router;
