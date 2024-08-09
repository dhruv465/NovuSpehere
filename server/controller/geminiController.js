const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateMessage = async (req, res) => {
    const { prompt } = req.body;

    try {
        const result = await model.generateContent(prompt);
        res.json({ message: result.response.text() });
    } catch (error) {
        console.error('Error generating message:', error);
        res.status(500).json({ error: 'Error generating message' });
    }
};

module.exports = { generateMessage };
