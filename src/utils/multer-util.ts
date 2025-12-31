import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Base uploads directory
const baseUploadsDir = path.join(__dirname, "../../public/uploads");

// Ensure base and subfolder directories exist
const usersDir = path.join(baseUploadsDir, "users");
const companiesDir = path.join(baseUploadsDir, "companies");

if (!fs.existsSync(usersDir)) {
	fs.mkdirSync(usersDir, { recursive: true });
}
if (!fs.existsSync(companiesDir)) {
	fs.mkdirSync(companiesDir, { recursive: true });
}

// Configure storage with dynamic destination based on field name
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		// Determine folder based on field name
		if (file.fieldname === "logo") {
			cb(null, companiesDir);
		} else if (file.fieldname === "profile_image") {
			cb(null, usersDir);
		} else {
			cb(null, baseUploadsDir);
		}
	},
	filename: (req, file, cb) => {
		// Generate unique filename: uuid + original extension
		const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
		cb(null, uniqueName);
	},
});

// File filter (only images)
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
	const allowedMimes = [
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/gif",
		"image/webp",
	];

	if (allowedMimes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error(`Only image files are allowed. Server menerima tipe: ${file.mimetype}`), false);
	}
};

export const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB max
	},
});
