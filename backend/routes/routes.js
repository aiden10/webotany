const express = require('express');
const Model = require('../models/model');

const router = express.Router()

router.get('/', (req, res) => {
    res.send("hello")
});
  
router.get('/getOne/:id', (req, res) => {
    res.send(req.params.id)
});

router.post('/post', async (req, res) => {
    try {
        const newPlant = new Model({
            plantName: req.body.plantName,
            age: req.body.age
        });
        await newPlant.save();
        res.status(201).json({ message: 'Plant created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
