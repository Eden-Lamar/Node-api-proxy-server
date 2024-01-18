// MY IMPORTS
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
require("dotenv").config()
require("colors")

const weatherRoute = require("./routes/router")

// INITIALIZE EXPRESS
const app = express()

// RATE LIMITING CONFIGURATION
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes (minutes * seconds * milliseconds)
	max: 100, // limit each IP to 100 requests per windowMs
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: "Too many requests from this IP, please try again after 15 minutes",
	statusCode: 429,
})

// APP CONFIGURATION MIDDLEWARE
app.use(express.json())
app.use(limiter)
app.use(cors()) // enable cors
app.use(morgan('dev'))

app.set("trust proxy", 1) // trust first proxy (nginx)

// ROUTES MIDDLEWARE
app.use("/api", weatherRoute)

// CONFIGURE PORT NUMBER
const PORT = process.env.PORT || 5000

// SETUP SERVER
app.listen(PORT, () => {
	console.log(`\nTHE FORCE IS WITH YOU ON PORT ${PORT}\n`.bold.trap.italic.bold.brightYellow)
})