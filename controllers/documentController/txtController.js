import sharp from "sharp";
import path from 'path';
import fs from "fs";
import pdfToTextLib from "pdf-to-text";
import { fileURLToPath } from 'url';
import Users from "../../models/usersModel.js";
import markdownpdf from "markdown-pdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import PPTXGenJS from "pptxgenjs";


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



export const document_txtToPdf = async (req, res) => {
    const format = req.body.format;
    // const userData = JSON.parse(req.body.userData);
    
    // Simplified path handling
    const filePath = path.join(__dirname, '..', '..', req.file.path);
    const outputDir = path.join(__dirname, '..', '..', 'uploads');
    const outputPath = path.join(outputDir, `output.${format}`);

    try {
        // Convert text to PDF
        const writeStream = fs.createWriteStream(outputPath);

        fs.createReadStream(filePath)
            .pipe(markdownpdf())
            .pipe(writeStream);

        writeStream.on('finish', async () => {
            console.log('TXT converted to PDF successfully.');

            // const user = await userCreditCheck(userData.email);
            // if (!user) {
            //     return res.status(423).send("No more credits!");
            // }

            // Send the modified TXT file as a response
            res.sendFile(outputPath, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    return res.status(500).send('Error sending file');
                }
                console.log('File sent successfully');
                // Uncomment the following lines if you want to delete the file after sending
                fs.unlink(outputPath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    }
                });
            });
        });

        writeStream.on('error', (err) => {
            console.error('Error writing file:', err);
            res.status(500).send('Error processing file');
        });

    } catch (error) {
        console.error('Error processing file:', error.message);
        res.status(500).send('Error processing file');
    }
};


export const document_txtToHtml = async (req, res) => {
    const format = req.body.format;
    // const userData = JSON.parse(req.body.userData);

    const filePath = path.join(__dirname, '..', '..', req.file.path);
    const outputDir = path.join(__dirname, '..', '..', 'uploads');
    const outputPath = path.join(outputDir, `output.${format}`);

    try {
        // Convert text to HTML
        function txtToHtml(txtContent) {
            return `<html><body><pre>${txtContent}</pre></body></html>`;
        }

        const txtContent = fs.readFileSync(filePath, 'utf-8');
        const htmlContent = txtToHtml(txtContent);

        fs.writeFileSync(outputPath, htmlContent);

        console.log('TXT converted to HTML successfully.');

        // const user = await userCreditCheck(userData.email);
        // if (!user) {
        //     return res.status(423).send("No more credits!");
        // }

        // Send the modified TXT to Html file as a response
        res.sendFile(outputPath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                return res.status(500).send('Error sending file');
            }
            console.log('File sent successfully');
            // Uncomment the following lines if you want to delete the file after sending
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



export const document_txtToDocx = async (req, res) => {
    const format = req.body.format;
    // const userData = JSON.parse(req.body.userData);
    
    // Simplified path handling
    const filePath = path.join(__dirname, '..', '..', req.file.path);
    const outputDir = path.join(__dirname, '..', '..', 'uploads');
    const outputPath = path.join(outputDir, `output.${format}`);

    try {
        // Convert text to Docx
        const txtContent = fs.readFileSync(filePath, 'utf-8');
        const paragraphs = txtContent.split('\n').map(line => new Paragraph(line));

        const doc = new Document({
            sections: [{
                properties: {},
                children: paragraphs,
            }],
        });

        const buffer = await Packer.toBuffer(doc);

        fs.writeFileSync(outputPath, buffer);
        console.log('TXT converted to DOCX successfully.');

        // const user = await userCreditCheck(userData.email);
        // if (!user) {
        //     return res.status(423).send("No more credits!");
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

export const document_txtToPptx = async (req, res) => {
    const format = req.body.format;
    // const userData = JSON.parse(req.body.userData);

    // Simplified path handling
    const filePath = path.join(__dirname, '..', '..', req.file.path);
    const outputDir = path.join(__dirname, '..', '..', 'uploads');
    const outputPath = path.join(outputDir, `output.${format}`);

    try {
        // Convert text to Pptx
        const txtContent = fs.readFileSync(filePath, 'utf-8');
        const lines = txtContent.split('\n');
        
        const pptx = new PPTXGenJS();

        // Constants for slide layout
        const maxLinesPerSlide = 15; // Adjust this number based on your font size and slide layout
        const lineHeight = 0.5;
        let slide;
        let yPosition;

        for (let i = 0; i < lines.length; i += maxLinesPerSlide) {
            slide = pptx.addSlide();
            yPosition = 0.5;

            lines.slice(i, i + maxLinesPerSlide).forEach(line => {
                slide.addText(line, { x: 1, y: yPosition, fontSize: 24 });
                yPosition += lineHeight;
            });
        }

        await pptx.writeFile(outputPath);
        console.log(`TXT converted to PPTX successfully as ${outputPath}`);

        // const user = await userCreditCheck(userData.email);
        // if (!user) {
        //     return res.status(423).send("No more credits!");
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
