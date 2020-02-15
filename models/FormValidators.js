const validateUserForm = (username, password) => {
    const condition = 2
    let errors = []
    if (!username || !password) {
        errors.push({
            msg: "All fields required."
        })
    } else {
        if (password.length < condition) {
            errors.push({
                msg: `Password must be at least ${condition} characters.`
            })
        }
    }
    return errors
}


const validateItemForm = (desc, price, loc) => {
    const condition = 0
    let errors = []

    if (!desc || !loc) {
        errors.push({
            msg: "Please enter all fields."
        })
    } else {
        if (price <= condition) {
            errors.push({
                msg: `Enter price greater than ${condition}.`
            })
        }
    }
    return errors
}


const ValidateImage = image => {
    let errors = []
    if (!image) {
        errors.push({
            msg: "Please add an image."
        })
    }
    return errors
}

module.exports = {
    validateUserForm,
    validateItemForm,
    ValidateImage
}