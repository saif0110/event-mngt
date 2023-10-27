
const validateLoginData = (data)=>{
    const error = {
        hasError: false,
        message: ""
    }
    if(!data.email && !data.password){
        error.hasError = true,
        error.message = "Data is required in request body part"
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

module.exports = validateLoginData