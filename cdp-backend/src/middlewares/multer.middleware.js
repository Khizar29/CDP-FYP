import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        const destination = "./public/temp";
        const originalName = file.originalname;
        const fileExtension = path.extname(originalName);
        const baseName = path.basename(originalName, fileExtension);
        
        let filename = originalName;
        let counter = 1;

        // Check if file exists, and if so, add a counter suffix
        while (fs.existsSync(path.join(destination, filename))) {
            filename = `${baseName}-${counter}${fileExtension}`;
            counter += 1;
        }

        cb(null, filename);

        // Save the accessible path to be used in your application
        req.savedImagePath = `/temp/${filename}`;
    }
});

export const upload = multer({ storage });
