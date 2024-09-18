const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://piyushkhandelia.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Load intents JSON
let intents;
fs.readFile('intents.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading intents.json:', err);
    return;
  }
  intents = JSON.parse(data);
  console.log('Intents loaded:', intents);
});

// Sample data for chatbot response
const guestHouses = {
  "IGH": {
    rooms: [
      { type: "Small", description: "One Queen size Bed", occupancy: {single: 1000, double: 1200} },
      { type: "Mezzanine", description: "Two single beds", occupancy: {single: 1200, double: 1500} },
      { type: "Large", description: "Two single beds", occupancy: {single: 1500, double: 2000} },
      { type: "Suites", description: "Luxury suite", occupancy: {double: 2500} }
    ]
  },
  "OGH": {
    rooms: [
      { type: "Large", description: "Double Bed Room", occupancy: {single: 1200, double: 1500} },
      { type: "Suites", description: "Luxury suite", occupancy: {double: 2500} }
    ]
  }
};

// API route to handle chatbot questions
app.post('/chatbot', (req, res) => {
  const message = req.body.message.toLowerCase();
  let reply = "";

  // Logic to handle chatbot questions using intents
  if (message.includes("cheapest room") && message.includes("igh") && message.includes("single occupancy")) {
    reply = `The cheapest room at IGH for single occupancy is the Small room at 1000.`;
  } else if (message.includes("price for a double room") && message.includes("large") && message.includes("ogh")) {
    reply = `The price for a Large room at OGH for double occupancy is 1500.`;
  } else if (message.includes("suite for two people") && message.includes("best price")) {
    reply = `Both IGH and OGH offer Suites at the same price of 2500 for double occupancy.`;
  } else {
    reply = "Sorry, I didn't understand that. Can you rephrase your question?";
  }

  res.json({ reply });
});

// Server start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});