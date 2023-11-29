const roles = {
    adminRole: "admin"
}

const createSuccessResponse = (data = {}) => {
    return {
        resCode: 200,
        status: "SUCCESS",
        data,
    };
};

const fiveHundredResponse = () => {
    return {
        resCode: 500,
        status: "FAILURE",
        message: "Internal server error. Please try again later."
    };
};

module.exports = {
    roles,
    createSuccessResponse,
    fiveHundredResponse
}