import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        console.log('Fetching available models...\n');

        // Try different model names
        const modelsToTry = [
            'gemini-pro',
            'gemini-1.5-pro',
            'gemini-1.5-flash',
            'gemini-1.0-pro',
            'models/gemini-pro',
            'models/gemini-1.5-pro',
            'models/gemini-1.5-flash'
        ];

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hello');
                console.log(`✅ ${modelName} - WORKS!`);
                console.log(`   Response: ${result.response.text().substring(0, 50)}...`);
                break; // Stop after first working model
            } catch (err) {
                console.log(`❌ ${modelName} - ${err.message.substring(0, 100)}`);
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

listModels();
