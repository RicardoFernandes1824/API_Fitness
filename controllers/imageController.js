const prisma = require('../utils/prisma')
const path = require('path');
const fs = require('fs');

const uploadUserPhoto = async (req, res) => {
    const { id } = req.params;
    // Ensure uploads/profile_pics directory exists
    const uploadDir = path.join(__dirname, '../uploads/profile_pics/');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Created directory:', uploadDir);
    }
    console.log('Received file:', req.file);
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const photoPath = `/uploads/profile_pics/${req.file.filename}`;
    console.log('Saving photoPath:', photoPath);
    try {
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { photo: photoPath }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { uploadUserPhoto }; 