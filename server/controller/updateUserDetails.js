const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");

async function updateUserDetails(request, response) {
    try {
        const token = request.cookies.token || "";
        const user = await getUserDetailsFromToken(token);

        if (!user) {
            return response.status(401).json({
                message: "Unauthorized",
                error: true
            });
        }

        const { name, profile_pic } = JSON.parse(request.body); // Parse the incoming JSON body

        if (!name) {
            return response.status(400).json({
                message: "Name is required",
                error: true
            });
        }

        const result = await UserModel.updateOne(
            { _id: user._id },
            { name, profile_pic }
        );

        if (result.nModified === 0) {
            return response.status(400).json({
                message: "No changes were made",
                error: true
            });
        }

        const userInformation = await UserModel.findById(user._id);

        return response.json({
            message: "User Updated Successfully",
            data: userInformation,
            success: true
        });
    } catch (error) {
        console.error('Error:', error.message || error);
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true
        });
    }
}

module.exports = updateUserDetails;

