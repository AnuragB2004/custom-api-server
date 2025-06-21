// src/utils/responses.js

function success(res, data = null, message = 'Success', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data
  });
}

function error(res, message = 'Something went wrong', status = 500, extra = {}) {
  return res.status(status).json({
    success: false,
    error: message,
    ...extra
  });
}

module.exports = { success, error };
