const roles = {
    adminRole: "admin"
}

const successResponse = (data = {}) => {
    return {
        resCode: 200,
        status: "SUCCESS",
        ...data,
    };
};

const twohundredResponse = (data = {}) => {
    return {
        resCode: 201,
        status: "SUCCESS",
        ...data,
    };
};

const fiveHundredResponse = () => {
    return {
        resCode: 500,
        status: "FAILURE",
        message: "Internal server error. Please try again later."
    };
};

const fourNotOneResponse = (data = {}) => {
    return {
        resCode: 401,
        status: "FAILURE",
        ...data
    };
};

const errorMessages = {
    invalidMsg: "Invalid username or password!",
    userNotfoundMsg: "User not found",
    notFoundMsg: "Not found",
    internalErrorMsg: "Internal server error. Please try again!",
    AccountLockedMsg: 'Account is locked. Try again later.',
    AuthSuccessMsg: "Authentication successfull",
    userAlreadyExistsMsg: "Username already exists. Choose a different username.",
    createdSuccessMsg:"Created successfully",

}

module.exports = {
    roles,
    successResponse,
    fiveHundredResponse,
    twohundredResponse,
    fourNotOneResponse,
    errorMessages
}