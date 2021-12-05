var express = require('express');
var router = express.Router();

const appid = require("appid");
const axios = require('axios');

router.get('/game', async function(req, res) {
    const {ID} = req.query
    let game = await appid(Number(ID));

    if (ID == undefined) {
        res.status(500);
        return res.json({
            error: "Missing ID parameter"
        });
    }
    if (game == undefined) {
        res.status(400);
        return res.json({
            error: "Can't find Steam game with ID: " + ID
        });
    }
    axios.get("https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=" + ID)
    .then(response => {
        return res.json({
            players: response.data['response']['player_count'],
            gameName: game.name
        });
    })
    .catch(error => {
        res.status(400);
        return res.json({
            error: "Unknown game",
            technicalDetails: error
        });
    });
});

router.get('/friends', async function(req, res) {
    const {ID} = req.query

    if (ID == undefined) {
        res.status(500);
        return res.send({
            error: "Missing ID parameter"
        });
    }
    await axios.get("https://api.steampowered.com/ISteamUser/GetFriendList/v1/?steamid=" + ID + "&key=" + process.env.STEAM_WEB_API_KEY)
    .then(response => {
        friendsList = response.data['friendslist']
    })
    .catch(error => {
        res.status(400);
        return res.json({
            error: "We're having authentication issues with Steam. It's more likely our API key is invalid."
        });
    });
    for (let index = 0; index < friendsList['friends'].length; index++) {
        const element = friendsList['friends'][index];
        await axios.get("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + process.env.STEAM_WEB_API_KEY + "&steamids=" + element['steamid'])
        .then(response => {
            console.log(element)
            element['avatar'] = response.data['response']['players'][0]['avatarfull']
            element['personaname'] = response.data['response']['players'][0]['personaname']
        })
        .catch(error => {
            res.status(400);
            return res.json({
                error: "We're having authentication issues with Steam. It's more likely our API key is invalid."
            });
        });
    }
    return res.json(friendsList)
});

module.exports = router;