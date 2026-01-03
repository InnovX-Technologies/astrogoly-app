import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Print Kundli Chart
 * @param {string} elementId - ID of the element to print
 * @param {string} fileName - Name for the PDF file
 */
export const printKundli = async (elementId, fileName = 'kundli-chart.pdf') => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error('Element not found');
        }

        // Show loading state
        const originalContent = element.innerHTML;

        // Create canvas from element
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        // Create PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(fileName);

        return { success: true };
    } catch (error) {
        console.error('Print error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Export Kundli as Image
 * @param {string} elementId - ID of the element to export
 * @param {string} fileName - Name for the image file
 */
export const exportAsImage = async (elementId, fileName = 'kundli-chart.png') => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error('Element not found');
        }

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        // Convert to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/png');

        return { success: true };
    } catch (error) {
        console.error('Export error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Share Kundli Chart
 * @param {string} elementId - ID of the element to share
 * @param {object} shareData - Data for sharing
 */
export const shareKundli = async (elementId, shareData = {}) => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error('Element not found');
        }

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        // Convert canvas to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

        // Create file from blob
        const file = new File([blob], 'kundli-chart.png', { type: 'image/png' });

        // Check if Web Share API is available
        if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: shareData.title || 'My Kundli Chart',
                text: shareData.text || 'Check out my Vedic birth chart from AstroNexa',
                files: [file]
            });
            return { success: true };
        } else {
            // Fallback: just download the image
            await exportAsImage(elementId);
            return { success: true, fallback: true };
        }
    } catch (error) {
        console.error('Share error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Copy chart as image to clipboard
 * @param {string} elementId - ID of the element to copy
 */
export const copyToClipboard = async (elementId) => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error('Element not found');
        }

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);

        return { success: true };
    } catch (error) {
        console.error('Copy error:', error);
        return { success: false, error: error.message };
    }
};

export default {
    printKundli,
    exportAsImage,
    shareKundli,
    copyToClipboard
};
