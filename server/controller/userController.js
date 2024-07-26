const UserModel = require('../models/UserModel');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken');

// Update user language preferences
exports.updateUserPreferences = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    const user = await getUserDetailsFromToken(token);

    if (user.logout) {
        return res.status(401).json({ message: user.message });
    }

    const { languages } = req.body;
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(user._id, { languages }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// controllers/userController.js
exports.getUserPreferences = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    const user = await getUserDetailsFromToken(token);

    if (user.logout) {
        return res.status(401).json({ message: user.message });
    }

    try {
        const userPreferences = await UserModel.findById(user._id);
        if (!userPreferences) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userPreferences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

