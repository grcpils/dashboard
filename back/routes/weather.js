var express = require('express');
var router = express.Router();
const kelvinToCelsius = require('kelvin-to-celsius');
const axios = require('axios');

router.get('/', function(req, res) {
    const {city, state, country} = req.query
    if (city == undefined) {
        res.status(500);
        return res.json({
            error: "Missing city parameter"
        });
    }
    axios.get("https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + (state ? state : '') + "," + (country ? country : '') + "&appid=" + process.env.OPEN_WEATHER_MAP_API_KEY)
    .then(response => {
        return res.json({
            city: response.data['name'],
            country: response.data['sys']['country'],
            situation: response.data['weather'][0]['main'],
            min: Math.round(kelvinToCelsius(response.data['main']['temp_min'])),
            max: Math.round(kelvinToCelsius(response.data['main']['temp_max'])),
            current: Math.round(kelvinToCelsius(response.data['main']['temp']))
        })
    })
    .catch(error => {
        res.status(400);
        return res.json({
            error: "We're having authentication issues with OpenWeatherMap. It's more likely our API key is invalid, check the environment file",
            technicalDetails: error
        });
    });
});

module.exports = router;