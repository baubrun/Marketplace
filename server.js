const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("dotenv/config")
const port = 4000
const cookieParser = require("cookie-parser")
const routes = require("./routes/routes")




app.listen(port, () => {
    console.log("Server running on port:", port, "\n")
})

app.use(express.json())
app.use(cookieParser())
app.use(routes)

app.use("/", express.static("uploads"))



// DB

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // dbName: "Marketplace"
}

mongoose.connect(
    // process.env.DB_URI, options

    //local db
    "mongodb://localhost:27017/Marketplace", options
)

const db = mongoose.connection
db.on("error", err => console.error(err))
db.once("open", () => console.log("Mongoose connected to DB!\n"))



