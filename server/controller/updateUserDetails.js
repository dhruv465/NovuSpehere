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

        console.log('User ID:', user._id);

        const { name, profile_pic } = request.body;
        console.log('Received data:', { name, profile_pic });

        if (!name || !profile_pic) {
            return response.status(400).json({
                message: "Name and profile picture are required",
                error: true
            });
        }

        await UserModel.updateOne(
            { _id: user._id },
            { name, profile_pic }
        );

        const userInformation = await UserModel.findById(user._id);
        console.log('Updated user info:', userInformation);

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
