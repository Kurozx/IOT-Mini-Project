import { Client } from 'pg';

let client; // ประกาศ client ไว้ภายนอก เพื่อใช้เป็น singleton

async function dbConnect() {
  try {
    // ตรวจสอบว่ามี client อยู่แล้วหรือไม่
    if (!client) {
      client = new Client({
        connectionString: process.env.DATABASE_URL, // ใช้ ENV สำหรับ URL ของฐานข้อมูล
        ssl: {
          rejectUnauthorized: false, // สำหรับการเชื่อมต่อ SSL ที่ไม่ต้องตรวจสอบ Certificate
        },
      });

      // ทำการเชื่อมต่อ
      await client.connect();
      console.log('Connected to the database');
    }

    return client; // คืนค่าการเชื่อมต่อ
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error; // โยนข้อผิดพลาดออกไปเพื่อให้ฟังก์ชันที่เรียกใช้ทราบว่าการเชื่อมต่อล้มเหลว
  }
}

export default dbConnect;
