import { NextResponse } from 'next/server';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Function to connect to the database
async function dbConnect() {
  if (!client._connected) {
    await client.connect();
    client._connected = true;
  }
  return client;
}

// Handle GET requests to fetch NeoPixel colors
async function handleGetRequest() {
  try {
    const client = await dbConnect();
    
    // Fetch the NeoPixel colors from the database
    const result = await client.query('SELECT "colors" FROM "NCN046" WHERE id = 1'); // Modify based on your conditions
    const colors = result.rows[0]?.colors || [];

    return NextResponse.json({ colors });
  } catch (error) {
    console.error("Error fetching NeoPixel colors:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (client) {
      await client.end();
      client._connected = false;
    }
  }
}

// Handle POST requests to update NeoPixel colors
async function handlePostRequest(req) {
  try {
    const client = await dbConnect();
    
    // Parse the request body
    const { colors } = await req.json();
    
    // Validate the colors input
    if (!Array.isArray(colors) || colors.length === 0 || !colors.every(color => Array.isArray(color) && color.length === 3)) {
      return NextResponse.json({ error: 'Invalid colors data' }, { status: 400 });
    }
    
    // Update the colors in the database
    await client.query(`
      UPDATE "NCN046"
      SET "colors" = $1, "date" = NOW()
      WHERE id = 1 -- Modify this condition based on your needs
    `, [colors]);

    return NextResponse.json({ message: 'NeoPixel colors updated successfully' });

  } catch (error) {
    console.error("Error updating NeoPixel colors:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (client) {
      await client.end();
      client._connected = false;
    }
  }
}

// Handle requests
export async function GET(req) {
  return handleGetRequest();
}

export async function POST(req) {
  return handlePostRequest(req);
}
