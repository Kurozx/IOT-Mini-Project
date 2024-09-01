export default function handler(req, res) {
    if (req.method === 'POST') {
        const { LDR, VR, TEMP, DISTANCE } = req.body;
        
        // คุณสามารถเก็บข้อมูลนี้ไว้ในฐานข้อมูลหรือตัวแปรในโปรเจกต์
        const data = { LDR, VR, TEMP, DISTANCE };

        // Response กลับไปยัง Microcontroller ว่ารับข้อมูลสำเร็จ
        res.status(201).json({ message: 'Data received successfully', data });
    } else {
        res.status(405).json({ message: 'Only POST requests are allowed' });
    }
}
