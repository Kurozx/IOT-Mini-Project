// app/api/attackCount/route.js
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await client.query(`
      SELECT att
      FROM "NCN046"
      WHERE id = $1
    `, [87]);

    if (result.rows.length > 0) {
      return new Response(JSON.stringify({ att: result.rows[0].att }), {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });
    } else {
      return new Response(JSON.stringify({ error: "No data found" }), {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
      },
    });
  }
}
