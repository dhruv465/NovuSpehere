const express = require('express')
const registerUser = require('../controller/registerUser')
const checkEmail = require('../controller/checkEmail')
const checkPassword = require('../controller/checkPassword')
const userDetails = require('../controller/userDetails')
const logout = require('../controller/logout')
const updateUserDetails = require('../controller/updateUserDetails')
const searchUser = require('../controller/SearchUser')
const translateController = require('../controller/translateController');
const userController = require('../controller/userController');
const { generateMessage } = require('../controller/geminiController');



const router = express.Router()

//create user API
router.post('/register', registerUser)

//check user EMail
router.post('/email', checkEmail)

//cehck user password
router.post('/password', checkPassword)

//cehck user details
router.get('/user-details', userDetails)

//logout user
router.get('/logout', logout)

//update user details
router.post('/update-user', updateUserDetails)

//search user
router.post('/search-user', searchUser)

//route for translate
router.post('/translate', translateController.translateText);

// Update user language preferences
router.put('/user/preferences', userController.updateUserPreferences);

// Get user language preferences
router.get('/user/:userId', userController.getUserPreferences);

router.post('/generate-message', generateMessage);

// Route to reset user preferences
router.post('/reset-preferences', userController.resetUserPreferences);

module.exports = router