import sharp from "sharp";
import path from 'path';
import fs from "fs";
import pdfToTextLib from "pdf-to-text";
import { fileURLToPath } from 'url';
import Users from "../../models/usersModel.js";
import XLSX from "xlsx";

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

export const spreadsheet_csvConversion = async (req, res) => {
    const format = req.body.format;
    // const userData = JSON.parse(req.body.userData);

    // Use path.join for platform-specific path handling
    const filePath = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
    const outputDir = path.join(__dirname, '..', '..', 'uploads');
    const outputPath = path.join(outputDir, `output.${format}`);

    try {
        // Load the CSV file
        const workbook = XLSX.readFile(filePath, {type: 'string'});
        
        // Convert CSV data to a worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(XLSX.utils.sheet_to_json(workbook, {header:1, raw:true}));
        
        // Create a new workbook with the CSV worksheet
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'Sheet1');
        
        // Function to convert and write to XLSX, XLS, and ODS
        function convertAndWrite() {

            XLSX.writeFile(newWorkbook, outputPath, { bookType: format });
            console.log(`Converted and saved as ${outputPath}`);
        }

        convertAndWrite();

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

    } catch (error) {
        console.error('Error processing file:', error.message);
        res.status(500).send('Error processing file');
    }
};
