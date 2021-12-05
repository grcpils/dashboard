var express = require('express');
var router = express.Router();

const axios = require('axios');

router.get('/', async function(req, res) {
    const {sourceCurrency, targetCurrency, amount} = req.query

    await axios.get("https://v6.exchangerate-api.com/v6/" + process.env.EXCHANGE_RATE_API_KEY + "/pair/" + sourceCurrency + "/" + targetCurrency + "/" + amount)
    .then(response => {
        return res.json({
            result: response['data']['conversion_result'],
            rate: response['data']['conversion_rate'],
            source_currency: response['data']['base_code'],
            target_currency: response['data']['target_code']
        })
    })
    .catch(error => {
        console.log(error)
        res.status(400);
        return res.json({
            error: "We're having authentication issues with Exchangerate-api. It's more likely our API key is invalid."
        });
    });
});

module.exports = router;