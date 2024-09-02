import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function dbConnect() {
  if (!client._connected) {
    await client.connect();
    client._connected = true;
  }
  return client;
}

export async function POST(req, res) {
  try {
    const { index, color } = req.body;
    const client = await dbConnect();

    // Insert NeoPixel command into the database
    await client.query(`INSERT INTO "NCN046" ("index", "color", "date") VALUES ($1, $2, NOW())`, [index, color]);

    console.log("NeoPixel command stored in the database");

    // Fetch the latest command from the database
    const result = await client.query(`SELECT "index", "color", "date" FROM "NCN046" ORDER BY "date" DESC LIMIT 1`);

    res.status(200).json({
      message: 'NeoPixel command stored successfully',
      latestCommand: result.rows[0],
    });
  } catch (error) {
    console.error("Error storing NeoPixel command:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (client) {
      await client.end();
      client._connected = false;
    }
  }
}
