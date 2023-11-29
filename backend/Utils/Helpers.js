const roles = {
    adminRole:"admin"
}

const createSuccessResponse = (data = {}) => {
    return {
      resCode: 200,
      status: "SUCCESS",
      data,
    };
  };

module.exports = {
    roles,
    createSuccessResponse
}