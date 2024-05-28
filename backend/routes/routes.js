const express = require('express');
const Plant = require('../models/plant'); // this seems to work the same as a db object  
const axios = require('axios');
require('dotenv').config();

const router = express.Router()
const TOKEN = process.env.TREFLE_TOKEN;

const getCertificate = async() =>{
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

router.get('/', (req, res) => {
    res.send("hello")
});
  
router.get('/getUserPlants/:email', async (req, res) => {
    try {
        const plants = await Plant.find({owner: req.params.email}); // get plants with user's email 
        res.json(plants)
    }
    catch (error){
        res.status(500).json({message: error.message})
    }
});

router.post('/addPlant', async (req, res) => {
    try {
        const newPlant = new Plant({
            plantName: req.body.plantName,
            owner: req.body.owner,
            location: req.body.location,
            imgURL: req.body.imgURL,
            date: req.body.datePlanted
        });
        await newPlant.save();
        res.status(201).json({ message: 'Plant created successfully' });
    } catch (err) {
        console.error(err);
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
