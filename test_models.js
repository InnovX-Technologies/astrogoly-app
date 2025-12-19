import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function checkModels() {
    if (!API_KEY) {
        console.error("❌ No API Key found in .env");
        return;
    }

    console.log("Checking available models for your API Key...");

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error.message);
            return;
        }

        if (data.models) {
            console.log("✅ Available Models:");
            const supportedModels = data.models
                .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name.replace("models/", ""));

            console.log(supportedModels.join("\n"));

            if (supportedModels.length === 0) {
                console.warn("⚠️ No models found that support 'generateContent'.");
            }
        } else {
            console.log("⚠️ No models returned in response:", data);
        }

    } catch (error) {
        console.error("❌ Network/Script Error:", error.message);
    }
}

checkModels();
