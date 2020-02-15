const router = require("express").Router()
const Item = require("../models/Items")
const User = require("../models/User")
const multer = require("multer")
const bcrypt = require("bcryptjs")
const SALT_FACTOR = 10
const Validators = require("../models/FormValidators")
const validateUserForm = Validators.validateUserForm
const validateItemForm = Validators.validateItemForm
const sessions = {}


const fileFilter = (req, file, cb) => {
    if (file !== undefined) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
    fileFilter: fileFilter
})


const upload = multer({
    storage: storage,
    limits: {
        fileSize: (1024 * 1024) * 5
    }
})



const generateId = () => {
    return "" + Math.floor(Math.random() * 1000000)
}

/* ===============
POST
================= */



router.post("/", upload.none(), async (req, res) => {
    const {
        username,
        password
    } = req.body

    const formErrors = validateUserForm(username, password)

    if (formErrors.length > 0) {
        return res.json({
            success: false,
            errors: formErrors
        })
    }

    const givenUsername = username
    const givenPassword = password
    let dbErrors = []

    await User.findOne({
        username: givenUsername
    }, async (err, user) => {
        if (err) {
            dbErrors.push({
                msg: "Internal error. Try again later."
            })
            res.status(500).json({
                errors: dbErrors,
                success: false
            })
        }
        if (user) {
            dbErrors.push({
                msg: "Username already taken."
            })
            return res.status(404).json({
                success: false,
                errors: dbErrors
            })
        } else {
            const hashPassword = await bcrypt.hash(givenPassword, SALT_FACTOR)

            try {
                const newUser = new User({
                    username: username,
                    password: hashPassword
                })
                await newUser.save()
                res.status(200).json({
                    success: true
                })


            } catch (err) {
                console.log(err)
                dbErrors.push({
                    msg: "Internal Error. Try again later."
                })
                res.status(400).json({
                    errors: dbErrors,
                    success: false
                })
            }
        }
    })
})


router.post("/login", upload.none(), async (req, res) => {
    const givenUsername = req.body.username
    const givenPassword = req.body.password
    let dbErrors = []
    const formErrors = validateUserForm(givenUsername, givenPassword)
    if (formErrors.length > 0) {
        return res.json({
            success: false,
            errors: formErrors
        })
    }
    const user = await User.findOne({
        username: givenUsername
    }, (err, user) => {
        if (err) {
            dbErrors.push({
                msg: "Internal Error. Try again later."
            })
            return res.status(500).json({
                msg: "Internal error. Try again later.",
                errors: dbErrors
            })
        }
        if (!user) {
            dbErrors.push({
                msg: "Invalid username or password."
            })
            return res.status(401).json({
                success: false,
                errors: dbErrors
            })
        }
    })
    try {
        if (await bcrypt.compare(givenPassword, user.password)) {

            const sessionId = generateId()
            sessions[sessionId] = givenUsername
            res.cookie("sid", sessionId)
            console.log("sid from login:", sessions)
            
            res.status(200).json({
                success: true
            })
        } else {
            dbErrors.push({
                msg: "Invalid username or password."
            })
            return res.status(401).json({
                success: false,
                errors: dbErrors
            })
        }
    } catch (err) {
        console.log(err)
        dbErrors.push({
            msg: "Internal Error. Try again later."
        })
        res.status(400).json({
            success: false,
            errors: dbErrors
        })
    }
})


router.post("/sell", upload.single("image"), async (req, res) => {
    let dbErrors = []
    const {
        description,
        price,
        location,
    } = req.body

    const formErrors = validateItemForm(description, price, location)

    if (formErrors.length > 0) {
        return res.json({
            success: false,
            errors: formErrors
        })
    }

    const item = new Item({
        description: description,
        price: price,
        location: location,
        image: req.file.originalname

    })

    await item.save((err) => {
        if (err) {
            console.log(err)
            dbErrors.push({
                msg: "Internal Error. Try again later."
            })
            return res.status(400).json({
                errors: dbErrors,
                success: false
            })
        }
        return res.status(200).json({
            success: true
        })
    })
})

router.get("/allitems", async (req, res) => {
    const items = await Item.find({}, (err) => {
        if (err) {
            console.log(err)
        }
    })
    res.json(items)
})


router.get("/data", async (req, res) => {
    const itemsFound = await Item.find({}, (err) => {
        if (err) {
            console.log(err)
        }
    })

    res.json(itemsFound)
})



module.exports = router

