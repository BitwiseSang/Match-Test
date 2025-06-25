import { fileURLToPath } from 'url'; // For converting file URL to path
import multer, { diskStorage } from 'multer';
import { join, dirname, extname as _extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Get the current file's path using import.meta.url
const __filename = fileURLToPath(import.meta.url);

// Get the current directory's path
const __dirname = dirname(__filename);

// Ensure upload directory exists
const uploadDir = join(__dirname, '../../uploads/avatars');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'avatar-' + uniqueSuffix + _extname(file.originalname));
  },
});

// File filter
const fileFilter = (_req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(_extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Export upload functions
export function single(fieldName) {
  return upload.single(fieldName);
}
export function array(fieldName, maxCount) {
  return upload.array(fieldName, maxCount);
}
export function fields(fields) {
  return upload.fields(fields);
}
export function none() {
  return upload.none();
}
export function any() {
  return upload.any();
}
