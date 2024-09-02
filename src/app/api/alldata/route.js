import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// เชื่อมต่อฐานข้อมูลเพียงครั้งเดียว
client.connect();

export const dynamic = 'force-dynamic';

// src/app/api/route.js
// -------------------------------------------------------------------------------------
export async function GET() {
  try {
    const result = await client.query('SELECT * FROM "NCN046"');
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('GET Error:', error.stack || error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(request) {
  try {
    // Parse JSON from the request
    const { ldr, vr, temp, distance } = await request.json();
    
    // Ensure data types are correct and valid
    const ldrParsed = parseInt(ldr, 10);
    const vrParsed = parseInt(vr, 10);
    const tempParsed = parseFloat(temp);
    const distanceParsed = parseFloat(distance);

    // Validate the data
    if (isNaN(ldrParsed) || isNaN(vrParsed) || isNaN(tempParsed) || isNaN(distanceParsed)) {
      return new Response(JSON.stringify({ error: 'Invalid data' }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Content-Type': 'application/json',
        },
      });
    }

    // Execute SQL query to insert data
    const res = await client.query('INSERT INTO "NCN046" (ldr, vr, temp, distance) VALUES ($1, $2, $3, $4) RETURNING *',
    [ldrParsed, vrParsed, tempParsed, distanceParsed]);

    // Return successful response
    return new Response(JSON.stringify(res.rows[0]), {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('POST Error:', error.stack || error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}
