const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

//route to fetch goals
app.get('/api/Goals', async(req, res) => {
    try {
        //fetch goals from Supabase
        const response = await axios.get('SUPABASE_ENDPOINT/Goals');
        const goals = response.data;
        res.json(goals);
    } catch(error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({message:'Internal Server Error'});
    }
});

//route to fetch users
app.get('/api/User', async (req,res) => {
    const {user_id, created_at, username, password} = req.body;
    try {
        //update progress in Supabase
        await axios.post('SUPABASE_ENDPOINT/user', {user_id, created_at, username, password});
        res.status(204).end();
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({message:'Internal Server Error'});
    }
});

app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});

//to start the server, navigate to this file and run 'node server.js', after starting the server
//open the 'timeline.html' file to view the timeline webpage.
//api/goals is a HTTP request in the Axios library
