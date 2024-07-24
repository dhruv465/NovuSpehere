const { Translate } = require('@google-cloud/translate').v2;

// Create a client with API key
const translate = new Translate({ key: 'AIzaSyDg4H2yjWWmpuCj7pKeQ3O5VpkOYb1Km-g' });

const translateText = async (req, res) => {
  const { text, targetLang } = req.body;

  try {
    const [translation] = await translate.translate(text, targetLang);
    res.json({ translatedText: translation });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ error: 'Failed to translate text' });
  }
};

module.exports = {
  translateText,
};
