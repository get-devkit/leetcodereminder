
//* ------------------- validation for emails ------------------------ *//
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/


/**
 * @function validateEmail
 * @description Validates recieved email
 * @returns true or false
 */

const validateEmail = (email) => {
    return emailRegex.test(email)
}

module.exports = validateEmail