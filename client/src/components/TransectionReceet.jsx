import React from 'react';
import { jsPDF } from 'jspdf';
import { Button, Stack } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import ShareIcon from '@mui/icons-material/Share';

const InvoicePDF = ({
    invoiceNumber,
    senderName,
    senderNumber,
    receiverName,
    receiverNumber,
    amountSend,
    rate,
    amountReceive,
    chargeFee,
    total
}) => {
    const generatePDF = () => {
        const doc = new jsPDF();

        // Centered Company Name
        doc.setFontSize(18);
        doc.text('Aloomairy Trading', 105, 20, { align: 'center' });
        doc.setFontSize(16);
        doc.text('WAKALA', 105, 30, { align: 'center' });

        // Sender and Receiver Information
        doc.setFontSize(10);
        doc.text(`Sender Name: ${senderName}`, 20, 50);
        doc.text(`Sender Number: ${senderNumber}`, 20, 55);
        doc.text(`Receiver Name: ${receiverName}`, 20, 65);
        doc.text(`Receiver Number: ${receiverNumber}`, 20, 70);
        doc.text(`Invoice No: ${invoiceNumber}`, 130, 50);
        doc.text(`Date & Time: ${new Date().toLocaleString()}`, 130, 55);

        // Configure font size to reduce spacing
        doc.setFontSize(10);  // Adjust as needed

        // Header for Amounts
        const headersY = 90;
        const startX = 20; // Initial X position for the first column
        const columnWidth = 30; // Adjusted column width for better fitting

        // Draw headers
        doc.text('Invoice No', startX, headersY);
        doc.text('Amount Send', startX + columnWidth, headersY);
        doc.text('Rate', startX + columnWidth * 2, headersY);
        doc.text('Amount Receive', startX + columnWidth * 3, headersY);
        doc.text('Charge Fee', startX + columnWidth * 4, headersY);
        doc.text('Total', startX + columnWidth * 5, headersY);

        // Draw header borders
        doc.rect(startX - 2, headersY - 5, columnWidth, 10); // Invoice NO
        doc.rect(startX + columnWidth - 2, headersY - 5, columnWidth, 10); // Amount Send
        doc.rect(startX + columnWidth * 2 - 2, headersY - 5, columnWidth, 10); // Rate
        doc.rect(startX + columnWidth * 3 - 2, headersY - 5, columnWidth, 10); // Amount Receive
        doc.rect(startX + columnWidth * 4 - 2, headersY - 5, columnWidth, 10); // Charge Fee
        doc.rect(startX + columnWidth * 5 - 2, headersY - 5, columnWidth, 10); // Total

        // Data (Amounts) aligned with headers
        const amountsY = headersY + 10; // Data row starts 10 units below headers

        // Example data for display
        doc.text(`${invoiceNumber}`, startX, amountsY);
        doc.text(`${amountSend}`, startX + columnWidth, amountsY);
        doc.text(`${rate}`, startX + columnWidth * 2, amountsY);
        doc.text(`${amountReceive}`, startX + columnWidth * 3, amountsY);
        doc.text(`${chargeFee}`, startX + columnWidth * 4, amountsY);
        doc.text(`${total}`, startX + columnWidth * 5, amountsY);

        // Draw data borders
        doc.rect(startX - 2, amountsY - 5, columnWidth, 10); // Invoice NO
        doc.rect(startX + columnWidth - 2, amountsY - 5, columnWidth, 10); // Amount Send
        doc.rect(startX + columnWidth * 2 - 2, amountsY - 5, columnWidth, 10); // Rate
        doc.rect(startX + columnWidth * 3 - 2, amountsY - 5, columnWidth, 10); // Amount Receive
        doc.rect(startX + columnWidth * 4 - 2, amountsY - 5, columnWidth, 10); // Charge Fee
        doc.rect(startX + columnWidth * 5 - 2, amountsY - 5, columnWidth, 10); // Total

        // Trigger the download of the PDF
        doc.save('invoice.pdf'); // Specify the filename for the download
    };

    const shareToWhatsApp = () => {
        generatePDF(); // Generate PDF
        const message = encodeURIComponent(`I am sending you the PDF invoice.`);
        const url = `https://api.whatsapp.com/send?text=${message}`;
        window.open(url, '_blank');
    };

    return (
        <div>
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                <Button variant="contained" color="primary" onClick={generatePDF} startIcon={<GetAppIcon />}>
                    Download PDF
                </Button>
                <Button variant="outlined" color="secondary" onClick={shareToWhatsApp} startIcon={<ShareIcon />}>
                    Share on WhatsApp
                </Button>
            </Stack>
        </div>
    );
};

export default InvoicePDF;