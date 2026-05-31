const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const safeBaseName = path
            .basename(file.originalname, fileExtension)
            .replace(/[^a-zA-Z0-9_-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') || 'product';
        let fileName = `${safeBaseName}${fileExtension}`;

        let fileIndex = 1;
        while (fs.existsSync(path.join(uploadPath, fileName))) {
            fileName = `${safeBaseName}_${fileIndex}${fileExtension}`;
            fileIndex++;
        }

        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Seuls les fichiers image sont acceptes.'));
    }
    cb(null, true);
};

module.exports = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
