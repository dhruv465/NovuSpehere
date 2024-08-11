const { GoogleGenerativeAI } = require('@google/generative-ai');

// Create a client with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const translateText = async (req, res) => {
  const { text, targetLang } = req.body;

  // Formulate a translation prompt for the model
  const prompt = `translate "${text}" to ${targetLang}.`;

  try {
    const result = await model.generateContent(prompt);

    // Assuming the translated text is the first sentence
    const fullResponse = result.response.text();
    const sentences = fullResponse.split('.');
    const translatedText = sentences[0].trim();

    res.json({ translatedText });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ error: 'Failed to translate text' });
  }
};

module.exports = { translateText };
