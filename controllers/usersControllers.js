const prisma = require('../utils/prisma')
const bcrypt = require('bcrypt');

const createUser = async (req, response) => {
    try {
        const { username, email, password } = req.body;

        // Check for missing required fields
        if (!username || !email || !password) {
            return response.status(400).json({ message: 'All fields are required.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user in the database
        const newUser = await prisma.user.create({
            data: {
                email: email,
                username: username,
                password: hashedPassword,
            },
        });

        // Respond with success
        response.status(201).json({
            message: 'Registration successful',
            user: {
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error('Error creating user:', error);
        // Handle specific errors (e.g., unique constraint violations)
        if (error.code === 'P2002') {
            // P2002 is Prisma's unique constraint violation code
            return response.status(409).json({
                message: `The ${error.meta.target} already exists.`,
            });
        }
        // Generic error response
        response.status(500).json({ message: 'An error occurred during registration.' });
    }
};


const updateUser = async (req, res) => {
    try {
        const userId = +req.params.id; // Convert userId to number

        // Check if userId is a valid number
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID." });
        }

        const updateData = req.body; // Get the update data from request body
        console.log(updateData);
        // Initialize an empty object to hold the fields we want to update
        const updatedFields = {};

        // Check and add valid fields to updatedFields
        if (updateData.firstName) {
            updatedFields.firstName = updateData.firstName;
        }
        if (updateData.lastName) {
            updatedFields.lastName = updateData.lastName;
        }
        if (updateData.gender) {
            updatedFields.gender = updateData.gender;
        }
        if (updateData.height) {
            updatedFields.height = +updateData.height;
        }
        if (updateData.weight) {
            updatedFields.weight = +updateData.weight;
        }
        // Check if no valid fields were provided to update
        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ error: "No valid data to update." });
        }
        // Attempt to update the user in the database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updatedFields,
        });
        // If no user found with the provided ID, throw a 404 error
        if (!updatedUser) {
            return res.status(404).json({ error: `User with ID ${userId} not found.` });
        }
        // Remove password from the response object
        delete updatedUser.password;
        // Send the updated user data as response
        res.json(updatedUser);

    } catch (error) {
        // Log the actual error for debugging purposes
        console.error('Error updating user:', error);
        // Enhanced error handling for known Prisma errors (e.g., user not found)
        if (error.code === 'P2025') { // Prisma error code for "Record not found"
            return res.status(404).json({ error: "User not found." });
        }
        // General error message for other issues
        res.status(500).json({ error: "An error occurred while updating the user." });
    }
};


const getUserById = async (req, response) => {
    try {
        // Extract the user ID from the request parameters
        const userId = parseInt(req.params.id, 10);

        if (isNaN(userId)) {
            return response.status(400).json({ message: 'Invalid user ID.' });
        }
        // Fetch the user by ID
        const userById = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!userById) {
            return response.status(404).json({ message: 'User not found.' });
        }
        // Remove the password field from the response
        delete userById.password;
        // Return the user
        response.status(200).json(userById);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        response.status(500).json({ message: 'An error occurred while fetching the user.' });
    }
};


module.exports = {
    createUser,
    updateUser,
    getUserById
}