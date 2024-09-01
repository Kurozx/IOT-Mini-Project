// src/app/api/updateAtt/route.js
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export async function POST(request) {
    try {
      // Increment the att value directly in the SQL query
      const updateRes = await client.query(
        'UPDATE "NCN046" SET att = att + 1 WHERE id = $1 RETURNING att',
        [87] // Update the record with id = 87
      );
  
      if (updateRes.rowCount === 0) {
        throw new Error('No rows updated');
      }
  
      const updatedValue = updateRes.rows[0].att;
  
      return new Response(JSON.stringify({ success: true, updatedValue }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      // Log the error to a log file
      const logPath = path.join(process.cwd(), 'log.txt');
      fs.appendFileSync(logPath, `${new Date().toISOString()} - ${error.message}\n`);
  
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }