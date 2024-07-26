import sharp from "sharp";
import path from 'path';
import fs from "fs";
import pdfToTextLib from "pdf-to-text";
import { fileURLToPath } from 'url';
import Users from "../../models/usersModel.js";

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

export const document_pdfToTxt = async (req, res) => {
    const format = req.body.format;
    const filePath = req.file.path;
    // const userData = JSON.parse(req.body.userData);

     // Simplified path handling

    try {
        // Convert PDF to text
        pdfToTextLib.pdfToText(filePath, async (err, data) => {
            if (err) {
                console.error('Error converting PDF to text:', err);
                return res.status(500).send('Error converting PDF to text');
            }

            // Write text data to file
            const outputDir = path.join(__dirname, '..', '..', 'uploads');
            const outputPath = path.join(outputDir, `output.${format}`);
            
            fs.writeFileSync(outputPath, data);
            console.log('PDF converted to TXT successfully.');

            // const user = await userCreditCheck(userData.email);
            // if (!user) {
            //     return res.status(423).send("No more credits ! ");
            // } 

                // Send the modified TXT file as a response
            res.sendFile(outputPath, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    return res.status(500).send('Error sending file');
                }
                console.log('File sent successfully');
                fs.unlink(outputPath, (err) => {
                    if (err) {
                      console.error('Error deleting file:', err);
                    }
                  });
            });
        });
    } catch (error) {
        console.error('Error processing file:', error.message);
        res.status(500).send('Error processing file');
    }
};





