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
      const { command } = await request.json();
      if (command !== 'RGB_ON' && command !== 'BUZZER_ON' && command !== 'OFF') {
          throw new Error('Invalid status');
      }

      const res = await client.query(
          'UPDATE "NCN046" SET command = $1 WHERE id = $2 RETURNING *',
          [command, 87] // ใช้ `1` เป็น ID ของแถวที่ต้องการอัปเดต หากมีหลายแถวให้ปรับเป็น ID ที่ต้องการ
      );

      if (res.rowCount === 0) {
          throw new Error('No rows updated');
      }

      return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
      });
  } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
      });
  }
}

// ฟังก์ชันจัดการคำขอ GET
export async function GET() {
  try {
    // ดึงข้อมูลสถานะปัจจุบันจากฐานข้อมูล
    const res = await client.query('SELECT command FROM "NCN046" WHERE id = $1', [87]);

    if (res.rowCount === 0) {
      throw new Error('No records found');
    }

    return new Response(JSON.stringify(res.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // บันทึกข้อผิดพลาดลงใน log.txt
    const logPath = path.join(process.cwd(), 'log.txt');
    fs.appendFileSync(logPath, `${new Date().toISOString()} - ${error.message}\n`);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}