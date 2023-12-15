const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs'); // Include the 'fs' module for file operations

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to save a trade
app.post('/saveTrade', (req, res) => {
    const tradeData = req.body.tradeData;
  console.log(`got new trades ${tradeData}`)
    // Read existing trades from the file
    const existingTrades = readTradesFromFile();

    if(existingTrades) {
        // Add the new trade to the existing trades
        existingTrades.push(tradeData);
        // Write the updated trades back to the file
      writeTradesToFile(existingTrades);
    } else {
      writeTradesToFile(tradeData);
    }

    res.json({ success: true, message: 'Trade saved successfully.' });
});

// Endpoint to get all trades
app.get('/getTrades', (req, res) => {
    // Read trades from the file
    const trades = readTradesFromFile();

    res.json(trades);
});

// Helper function to read trades from the file
function readTradesFromFile() {
    let tradesFilePath = 'trades.json';
      // Check if the file exists
    if (!fs.existsSync(tradesFilePath)) {
        // If not, create an empty array and write it to the file
        fs.writeFileSync(tradesFilePath, '[]');
    }
    try {
        // Read trades.json file synchronously
        const tradesData = fs.readFileSync('trades.json', 'utf-8');
        if (tradesData.length != 0) {
          return JSON.parse(tradesData);
        } else {
          return[];
        }
    } catch (error) {
        console.error('Error reading trades from file:', error);
        return [];
    }
}

// Helper function to write trades to the file
function writeTradesToFile(trades) {
    try {
        console.log(trades)
        // Write trades to trades.json file synchronously
        fs.writeFileSync('trades.json', JSON.stringify(trades, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing trades to file:', error);
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
