import fs from 'fs';

export const removeImages = async (filePath: string) => {
    try {
        await fs.unlinkSync(filePath);
        console.log('Image deleted successfully!');
    } catch (err: unknown) {
        // Use unknown for general errors
        if (err instanceof Error) {
            console.error('Error deleting image:', err.message);
        } else {
            console.error('Unexpected error deleting image:', err);
        }
    }
};