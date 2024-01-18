const express = require("express")
const needle = require("needle")
const apicache = require("apicache")
const url = require("url")

const router = express.Router()

// Api Url Example
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// Env variables
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE

// init cache
let cache = apicache.middleware

router.get("/", cache("2 minutes"), async (req, res) => {
	try {
		const params = new URLSearchParams({
			[API_KEY_NAME]: API_KEY_VALUE,
			...url.parse(req.url, true).query
		})

		const apiRes = await needle("get", `${API_BASE_URL}?${params}`)
		const data = apiRes.body

		// Log Request to public Api
		if (process.env.NODE_ENV !== "production") {
			console.log(`REQUEST: ${API_BASE_URL}?${params}`)
		}

		res.status(200).json({
			status: "success",
			data,
		})

	} catch (error) {
		res.status(500).json({
			status: "fail",
			error
		})
	}
})


module.exports = router