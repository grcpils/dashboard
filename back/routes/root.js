var express = require('express');
var router = express.Router();

router.get('/', (_, res) => {
    return res.send('Welcome to the Dashboard API.');
});

router.get('/about.json', (req, res) => {
    const curr_timestamp = Math.floor(new Date() / 1000);
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return res.json({
        client: {
            host: ip
        },
        server: {
            current_time: curr_timestamp,
            services: {
                name: "weather",
                widgets: [
                    {
                        name: "city_temperature",
                        description: "Display temperature of a city",
                        params: [
                            {
                                name: "city",
                                type: "string"
                            },
                            {
                                name: "state",
                                type: "string"
                            },
                            {
                                name: "country",
                                type: "string"
                            }
                        ]
                    }
                ],
                name: "steam",
                widgets: [
                    {
                        name: "friends",
                        description: "Display the list of friends of a user",
                        params: [
                            {
                                name: "steamID",
                                type: Number
                            }
                        ]
                    },
                    {
                        name: "game",
                        description: "Display the number of players on a specific game",
                        params: [
                            {
                                name: "gameID",
                                type: Number
                            }
                        ]
                    }
                ]
            }
        }
    });
});

module.exports = router;