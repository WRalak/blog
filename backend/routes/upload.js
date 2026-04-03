const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { authenticate } = require('../middleware/auth');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../public/uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const isValid = allowed.test(path.extname(file.originalname).toLowerCase()) || allowed.test(file.mimetype);
    cb(null, isValid);
  }
});

router.post('/', authenticate, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  if (process.env.AWS_S3_BUCKET) {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();
    const fileStream = fs.createReadStream(req.file.path);
    const key = `uploads/${req.file.filename}`;

    try {
      await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: fileStream,
        ContentType: req.file.mimetype,
        ACL: 'public-read'
      }).promise();

      fs.unlinkSync(req.file.path);

      const url = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
      return res.json({ url });
    } catch (error) {
      return res.status(500).json({ error: 'S3 upload failed' });
    }
  }

  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;
