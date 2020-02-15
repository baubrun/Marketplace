const mongoose = require("mongoose")
const Schema = mongoose.Schema


const ItemSchema = new Schema({

    description: String,
    inventory: {type: Number, default: 5},
    price: Number,    
    image: String,
    id: {type: String, default: mongoose.Types.ObjectId},
    location: String
})


module.exports = mongoose.model("Item", ItemSchema)