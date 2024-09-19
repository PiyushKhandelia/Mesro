const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());

let guestHouses = {
  "IGH": {
    rooms: [
      { type: "Small", description: "One Queen size Bed", occupancy: { single: 1000, double: 1200 } },
      { type: "Mezzanine", description: "Two single beds", occupancy: { single: 1200, double: 1500 } },
      { type: "Large", description: "Two single beds", occupancy: { single: 1500, double: 2000 } },
      { type: "Suites", description: "Luxury suite", occupancy: { double: 2500 } }
    ]
  },
  "OGH": {
    rooms: [
      { type: "Large", description: "Double Bed Room", occupancy: { single: 1200, double: 1500 } },
      { type: "Suites", description: "Luxury suite", occupancy: { double: 2500 } }
    ]
  }
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/chatbot', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Based on the guest house data for BIT Mesra, generate multiple possible responses for the user's query: "${userMessage}".\n\nData: ${JSON.stringify(guestHouses)}`,
      temperature: 0.7,
      max_tokens: 150,
      n: 3, // Generate up to 3 responses
    });

    const replies = response.data.choices.map(choice => choice.text.trim());
    res.json({ replies });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
