import sharp from "sharp";
import path from 'path';
import fs from "fs";
import { fileURLToPath } from 'url';
import Users from "../../models/usersModel.js";
import docxConverter from "docx-pdf";
import mammoth from "mammoth";

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

export const document_docxToHtml = async (req, res) => {
    const format = req.body.format;
    // const userData = JSON.parse(req.body.userData);

    // Use path.join for platform-specific path handling
    const filePath = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
    const outputDir = path.join(__dirname, '..', '..', 'uploads');
    const outputPath = path.join(outputDir, `output.${format}`);

    try {
        // Check if RTF file exists
        // await fs.access(filePath);
        // console.log("File found:", filePath);
        
        const convertDocxToHtml = async (inputPath, outputPath) => {
            const docxBuffer = fs.readFileSync(inputPath);
            const result = await mammoth.convertToHtml({ buffer: docxBuffer });
            fs.writeFileSync(outputPath, result.value);
            console.log("DOCX to HTML conversion completed.");
          };
          
          convertDocxToHtml(filePath, outputPath);

        // Perform user credit check
        // const user = await userCreditCheck(userData.email);
        // if (!user) {
        //     return res.status(423).send('No more credits!');
        // }

        // Send the modified HTML file as a response
        res.sendFile(outputPath, async (err) => {
            if (err) {
                console.error('Error sending file:', err);
                return res.status(500).send('Error sending file');
            }
            console.log('File sent successfully');

            // Optionally, delete the file after sending
            await fs.unlink(outputPath, (err) => {
                if (err) {
                  console.error('Error deleting file:', err);
                } else {
                  console.log('File deleted successfully');
                }
            });
        });
    } catch (error) {
        console.error('Error processing file:', error.message);
        res.status(500).send('Error processing file');
    }
};

export const document_docxToPdf = async (req, res) => {
    const format = req.body.format;
    // const userData = JSON.parse(req.body.userData);

    // Use path.join for platform-specific path handling
    const filePath = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
    const outputDir = path.join(__dirname, '..', '..', 'uploads');
    const outputPath = path.join(outputDir, `output.${format}`);

    try {
        const convertDocxToHtml = (inputPath, outputPath) => {
            return new Promise((resolve, reject) => {
                docxConverter(inputPath, outputPath, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        // Perform the conversion and wait for it to complete
        await convertDocxToHtml(filePath, outputPath);

        // Perform user credit check
        // const user = await userCreditCheck(userData.email);
        // if (!user) {
        //     return res.status(423).send('No more credits!');
        // }

        // Send the modified HTML file as a response
        res.sendFile(outputPath, async (err) => {
            if (err) {
                console.error('Error sending file:', err);
                return res.status(500).send('Error sending file');
            }
            console.log(outputPath);
            console.log('File sent successfully');

            // Optionally, delete the file after sending
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

export const document_docxToTxt = async (req, res) => {
    const format = req.body.format;
    // const userData = JSON.parse(req.body.userData);

    // Use path.join for platform-specific path handling
    const filePath = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
    const outputDir = path.join(__dirname, '..', '..', 'uploads');
    const outputPath = path.join(outputDir, `output.${format}`);

    try {
                
        const convertDocxToText = async (inputPath, outputPath) => {
            const docxBuffer = fs.readFileSync(inputPath);
            const result = await mammoth.extractRawText({ buffer: docxBuffer });
            fs.writeFileSync(outputPath, result.value);
            console.log('DOCX to text conversion completed.');
        };

        // Perform the conversion and wait for it to complete
        await convertDocxToText(filePath, outputPath);

        // Perform user credit check
        // const user = await userCreditCheck(userData.email);
        // if (!user) {
        //     return res.status(423).send('No more credits!');
        // }

        // Send the modified HTML file as a response
        res.sendFile(outputPath, async (err) => {
            if (err) {
                console.error('Error sending file:', err);
                return res.status(500).send('Error sending file');
            }
            console.log(outputPath);
            console.log('File sent successfully');

            // Optionally, delete the file after sending
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