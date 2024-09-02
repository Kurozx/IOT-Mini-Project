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

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await dbConnect();
      const result = await client.query('SELECT * FROM "NCN046" ORDER BY "date" DESC LIMIT 1');
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching control command:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      if (client) {
        await client.end();
        client._connected = false;
      }
    }
  } else if (req.method === 'POST') {
    try {
      const { command } = req.body;
      const client = await dbConnect();
      await client.query('INSERT INTO "ControlCommand" ("command", "date") VALUES ($1, NOW())', [command]);
      res.status(201).json({ message: 'Command stored successfully' });
    } catch (error) {
      console.error("Error storing control command:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      if (client) {
        await client.end();
        client._connected = false;
      }
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
