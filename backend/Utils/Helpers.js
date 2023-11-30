const roles = {
    adminRole: "admin",
    studentRole: "student",
    teacherRole: "teacher"
}

const twohundredResponse = (data = {}) => {
    return {
        resCode: 200,
        status: "SUCCESS",
        ...data,
    };
};

const twoNotOneResponse = (data = {}) => {
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

const fourNotFourResponse = (data = {}) => {
    return {
        resCode: 404,
        status: "FAILURE",
        ...data
    };
};

const resMessages = {
    invalidMsg: "Invalid username or password!",
    userNotfoundMsg: "User not found",
    notFoundMsg: "Requested data not found",
    internalErrorMsg: "Internal server error. Please try again!",
    AccountLockedMsg: 'Account is locked. Try again later.',
    AuthSuccessMsg: "Authentication successfull",
    userAlreadyExistsMsg: "Username already exists. Choose a different username.",
    createdSuccessMsg: "Created successfully",
}

module.exports = {
    roles,
    twoNotOneResponse,
    fiveHundredResponse,
    twohundredResponse,
    fourNotOneResponse,
    resMessages,
    fourNotFourResponse
}