import sharp from "sharp";
import path from 'path';
import fs from "fs/promises";
import { fileURLToPath } from 'url';
import Users from "../models/usersModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userCreditCheck = async (email) => {
    try {
        const user = await Users.findOneAndUpdate(
            { 
                email: email,
                credits: { $gt: 0 } // Check if credits are greater than 0
            },
            { $inc: { credits: -1 } }, // Decrement credits by 1
            { new: true } // Return updated document
        );

        return user; // Return the user document or null
    } catch (error) {
        throw { message: 'User not found or error updating credits', error };
    }
}

export const image_converter = async (req, res) => {

    // const userData = JSON.parse(req.body.userData);    
    const filePath = path.join(__dirname, '..', req.file.path); // Adjust the path accordingly
    const outputPath = path.join(__dirname, '..', 'tmp/uploads', 'output.png'); // Adjust the path accordingly


    try {
        // Check if the file exists before processing
        console.log(filePath);
        await fs.access(filePath);

        // Convert the file using sharp
        await sharp(filePath)
            .toFormat('png')
            .toFile(outputPath);

        console.log('Image converted to PNG successfully');

        // const user = await userCreditCheck(userData.email);
        // if (!user) {
        //     return res.status(423).send("No more credits ! ");
        // }
        // Send the image file
        res.sendFile(outputPath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            } else {
                console.log('File sent successfully');
                // Optionally, delete the output file after sending
                fs.unlink(outputPath).catch(err => console.error('Error deleting file:', err));
            }
        });
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('File does not exist:', filePath);
            res.status(404).send('File not found');
        } else {
            console.error('Error processing file:', error.message);
            res.status(500).send('Error processing file');
        }
    }

};
