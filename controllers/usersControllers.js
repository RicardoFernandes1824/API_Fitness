const prisma = require('../utils/prisma')
const bcrypt = require('bcrypt');

const createUser = async (req, response) => {
    try {
        const {username, email, password} = req.body;

        // Check for missing required fields
        if (!username || !email || !password) {
            return response.status(400).json({message: 'All fields are required.'});
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
        response.status(500).json({message: 'An error occurred during registration.'});
    }
};


const updateUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId)) return res.status(400).json({error: "Invalid user ID."});

        const {username, email, firstName, lastName, gender, height, weight, password} = req.body;
        const updatedFields = {};

        if (username) {
            const existingUser = await prisma.user.findUnique({
                where: {username}
            });

            if (existingUser) {
                return res.status(400).json({error: "Username already taken."});
            }

            updatedFields.username = username;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({error: "Invalid email format."});
        }
        if (email) updatedFields.email = email;

        if (firstName) updatedFields.firstName = firstName;
        if (lastName) updatedFields.lastName = lastName;
        if (gender) updatedFields.gender = gender;
        if (height) updatedFields.height = Number(height);
        if (weight) updatedFields.weight = Number(weight);

        if (password) {
            updatedFields.password = await bcrypt.hash(password, 10);
        }

        if (!Object.keys(updatedFields).length) {
            return res.status(400).json({error: "No valid data to update."});
        }

        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: updatedFields,
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                gender: true,
                height: true,
                weight: true
            }
        });

        return res.json(updatedUser);

    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(error.code === "P2025" ? 404 : 500).json({error: "An error occurred while updating the user."});
    }
};


const getUserById = async (req, response) => {
    try {
        // Extract the user ID from the request parameters
        const userId = parseInt(req.params.id, 10);

        if (isNaN(userId)) {
            return response.status(400).json({message: 'Invalid user ID.'});
        }
        // Fetch the user by ID
        const userById = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!userById) {
            return response.status(404).json({message: 'User not found.'});
        }
        // Remove the password field from the response
        delete userById.password;
        // Return the user
        response.status(200).json(userById);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        response.status(500).json({message: 'An error occurred while fetching the user.'});
    }
};

const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const user = await prisma.user.findUnique({where: {id: userId}});

        if (!user) {
            return res.status(404).json({message: `User with ID ${userId} not found`});
        }

        await prisma.user.delete({where: {id: userId}});

        res.status(200).json({message: `User with ID ${userId} deleted successfully`});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};


module.exports = {
    createUser,
    updateUser,
    getUserById,
    deleteUser
}