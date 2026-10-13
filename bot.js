const makeWASocket = require('@whiskeysockets/baileys').default
const { useMultiFileAuthState } = require('@whiskeysockets/baileys')
const cron = require('node-cron')
const express = require('express')
const fs = require('fs')

const app = express()
app.get('/', (req,res) => res.send('Bot alive! ABSEN NYAWA AMERTA'))
app.listen(10000)

const GROUP_NAME = 'KOPERASI BUAH SEHAT BERMARTABAT'
const MESSAGE = '🚨 Reminder ABSEN NYAWA AMERTA 🚨!!!\n\nWaktunya absen ya teman-teman! Jangan lupa isi absennya sekarang.'

async function startBot(){
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  const sock = makeWASocket({ auth: state, printQRInTerminal: true })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async ({connection}) => {
    if(connection === 'open') console.log('✅ Connected!')
  })

  // Daily 7pm WIB
  cron.schedule('0 19 * * *', async () => {
    try {
      const groups = await sock.groupFetchAllParticipating()
      const groupId = Object.keys(groups).find(id => groups[id].subject === GROUP_NAME)
      if(groupId){
        await sock.sendMessage(groupId, { text: MESSAGE })
        console.log('Sent reminder!')
      }
    } catch(e){ console.log(e) }
  }, { timezone: "Asia/Jakarta" })
}

startBot()
