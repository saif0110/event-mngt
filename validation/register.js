
const validateRegistrationData = (data)=>{
    const error = {
        hasError: false,
        message: ""
    }
    if(!data.name && !data.email && !data.password){
        error.hasError = true,
        error.message = "Data is required in request body part"
    }
    else if(!data.name){
        error.hasError = true,
        error.message = "Name is required in request body part"
    }
    else if(!data.email){
        error.hasError = true,
        error.message = "Email is required in request body part"
    }
    else if(!data.password){
        error.hasError = true,
        error.message = "Password is required in request body part"
    }
    return error
}

module.exports = validateRegistrationData