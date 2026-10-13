const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const express = require('express');

const app = express();
app.get('/', (req,res) => res.send('Bot is alive!'));
app.listen(10000, () => console.log('Web server running'));

const GROUP_NAME = 'KOPERASI BUAH SEHAT BERMARTABAT';
const MESSAGE = '🚨 Reminder ABSEN NYAWA AMERTA 🚨!!!\n\nWaktunya absen ya teman-teman! Jangan lupa isi absennya sekarang.';

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', qr => {
  qrcode.generate(qr, {small: true});
  console.log('QR:', qr); // also log raw QR to see in Render logs
});

client.on('ready', () => console.log('✅ Bot ready! Will send daily at 19:00 WIB'));

client.initialize();

cron.schedule('0 19 * * *', async () => {
  const chats = await client.getChats();
  const group = chats.find(c => c.isGroup && c.name === GROUP_NAME);
  if(group){
    await client.sendMessage(group.id._serialized, MESSAGE);
    console.log('Reminder sent!');
  }
}, { timezone: "Asia/Jakarta" });