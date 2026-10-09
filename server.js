const express = require("express");
const { SerialPort, ReadlineParser } = require("serialport");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());

// ✅ Store the most recent Arduino data (with a safe default)
let latestData = {
  temperature: null,
  humidity: null,
  pressure: null,
  altitude: null,
  co2: null,
  aqi: null,
  timestamp: Date.now()
};

// ✅ Open SerialPort (update COM4 to match your Arduino port)
const port = new SerialPort({
  path: "COM4",
  baudRate: 115200,
});

// ✅ Create a line-by-line parser
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

// ✅ Listen for data from Arduino
parser.on("data", (line) => {
  try {
    // ✅ Ignore lines that don't look like JSON
    if (!line.trim().startsWith("{")) {
      console.log("ℹ️ Ignored non-JSON line:", line.trim());
      return;
    }

    // ✅ Parse JSON safely
    const parsed = JSON.parse(line);
    latestData = {
      ...parsed,
      timestamp: Date.now() // add timestamp for frontend freshness
    };
    console.log("✅ Parsed data:", latestData);
  } catch (err) {
    console.error("❌ Failed to parse JSON:", err.message, "Line:", line);
  }
});

// ✅ API Endpoint for frontend
app.get("/data", (req, res) => {
  // ✅ Return safe fallback if no data has been received yet
  if (!latestData.temperature) {
    return res.json({
      temperature: 0,
      humidity: 0,
      pressure: 0,
      altitude: 0,
      co2: 0,
      aqi: 0,
      timestamp: null,
      message: "⚠️ No data received from Arduino yet."
    });
  }
  res.json(latestData);
});

// ✅ Handle SerialPort errors gracefully
port.on("error", (err) => {
  console.error("❌ SerialPort Error:", err.message);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
