const express = require('express');
const Plant = require('../models/plant'); // this seems to work the same as a db object  
const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const router = express.Router()
const TOKEN = process.env.TREFLE_TOKEN;
const WEATHER_API_KEY = process.env.WEATHER_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SENDER_EMAIL,
      pass: EMAIL_PASSWORD
    }
  });

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

const getCertificate = async () => {
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
  
const fetchWeather = async (location) => {
    try {
        const response = await axios({
            method: 'get',
            url: `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}`,
        });
        console.log(response.data)
        return response.data;
    } 
    catch (error) {
        console.error(error);
        throw error;
    }
}

const sendEmail = async (owner, location, daysSinceRain, plantName) => {
    var mailOptions = {
        from: SENDER_EMAIL,
        to: owner,
        subject: 'Webotany: Your plant may need watering!',
        text: `Dear ${owner}, 
        It's been an estimated ${daysSinceRain} days since your ${plantName} located in ${location} has recieved water!
        This was determined by monitoring the weather in the region where it's located. 
        If you have watered your plant already, please disregard this message.
        If you wish to not recieve these messages leave the location field blank when adding a plant.

        Note: This is an automated message, please do not reply.`
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.error(error);
            throw error;
        } 
        else {
            console.log('Email sent: ' + info.response);
        }
    }); 
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
        res.status(201).json({ message: 'Plant created successfully', newPlant });
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

module.exports = {
    router: router,
    rainCheck: async function(){
        try {
            const allPlants = await Plant.find();

            for (const plant of allPlants){
                const weatherResponse = await fetchWeather(plant.location);
                if (weatherResponse && weatherResponse.forecast){
                    const precipitation = weatherResponse.forecast.forecastday[0].day.totalprecip_mm;
                    if (precipitation > 5){ // rained, amount could be user set
                        plant.daysSinceRain = 0;
                    }
                    else{
                        plant.daysSinceRain++;
                    }
                    if (plant.daysSinceRain > 2){
                        console.log('Sending email to ' + plant.owner);
                        sendEmail(plant.owner, plant.location, plant.daysSinceRain, plant.plantName)
                    }
                    await plant.save();
                }
            }
        }
        catch (error){
            console.error(error);
        }
    }
};
