import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Initialize and manage the database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Create a connection manager that only connects if not already connected
async function dbConnect() {
  if (!client._connected) {
    await client.connect();
    client._connected = true; // Set a flag to indicate the connection is established
  }
  return client;
}

// Handle POST requests to store the NeoPixel colors
export async function POST(req) {
  let client;
  try {
    // Connect to the database
    client = await dbConnect();

    // Parse the request body
    const { colors } = await req.json();
    if (!Array.isArray(colors) || colors.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid colors data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert the NeoPixel colors into the database
    await client.query(`INSERT INTO "NCN046" ("colors", "date") VALUES ($1, NOW())`, [JSON.stringify(colors)]);

    console.log("NeoPixel colors stored in the database");

    // Fetch the latest NeoPixel colors from the database
    const result = await client.query(`SELECT "colors", "date" FROM "NCN046" ORDER BY "date" DESC LIMIT 1`);

    // Return the latest data
    return new Response(JSON.stringify({
      message: 'NeoPixel colors stored successfully',
      latestColors: result.rows[0], // The most recent colors
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error storing NeoPixel colors:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    // Reset the client connection state after the work is done
    if (client) {
      await client.end();
      client._connected = false; // Reset the connection flag
    }
  }
}
