const prisma = require('../utils/prisma')
const bcryt = require('bcrypt');
const jwt = require('jsonwebtoken')

const login = async (request, response) => {
    const { username, password } = request.body;
    try {
    const findUser = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    if(!findUser) {
        return response.sendStatus(401)
    }

    const validPassword = await bcryt.compare(password, findUser.password);

    if(!validPassword) {
        return response.status(403).json({
            message: "Wrong password"
        })
    }

    const accessToken = jwt.sign(
        {"email": findUser.username, "id": findUser.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    response.json({
        message: "Enjoy your access token!",
        token: accessToken
    })
    } catch (error){
        console.log(error)
    }
}


module.exports = {
    login
}