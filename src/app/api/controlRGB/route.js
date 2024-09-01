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

// Handle POST requests to store the RGB command
export async function POST(req) {
  let client;
  try {
    // Connect to the database
    client = await dbConnect();

    // Insert the RGB control command into the database
    await client.query(`
      INSERT INTO "NCN046" ("command", "date")
      VALUES ($1, NOW())
    `, ['RGB_ON']);

    console.log("RGB control command stored in the database");

    // Fetch the latest command from the database
    const result = await client.query(`SELECT "command", "date" FROM "NCN046" ORDER BY "date" DESCLIMIT 1`);

    // Return the latest data
    return new Response(JSON.stringify({
      message: 'RGB control command stored successfully',
      latestCommand: result.rows[0], // The most recent command
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error storing RGB command:", error);
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
