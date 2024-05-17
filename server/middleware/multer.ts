import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs'

const productImageStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        const uploadPath = './uploads/products'; // Specify your desired upload folder

        // Check if the folder exists, create it if not
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname); // Get the file extension
        const timestamp = Date.now(); // Get the current timestamp
        const uniqueFilename = `${timestamp}${extname}`; // Custom filename format
        cb(null, uniqueFilename);
    }
});

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void
) => {
    // Allow only certain file types
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
    }
};

export const uploadProductImage = multer({
    storage: productImageStorage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
    },
    // @ts-ignore
    fileFilter: fileFilter
});