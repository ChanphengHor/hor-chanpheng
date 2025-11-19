const admin = require('firebase-admin');
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');

admin.initializeApp();

const TELEGRAM_TOKEN = defineSecret('TELEGRAM_TOKEN');
const CHANNEL_ID = defineSecret('CHANNEL_ID');

exports.sendPhengDashboardMessage = onRequest(
  { secrets: [TELEGRAM_TOKEN, CHANNEL_ID] },   // <-- v2: options object here
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).send('');
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
      const telegramToken = TELEGRAM_TOKEN.value();
      const channelId = CHANNEL_ID.value();

      // Only accept event type from client - message content is server-controlled
      const { event } = req.body || {};
      
      // Define messages server-side to prevent client modification
      const messages = {
        cv_viewed: {
          title: "Alert",
          content: "Someone just viewed your CV!"
        },
        cv_downloaded: {
          title: "Alert",
          content: "Someone just downloaded your CV!"
        }
      };

      // Only process known events
      if (!event || !messages[event]) {
        return res.status(400).send('Invalid event type');
      }

      const messageData = messages[event];
      const message = `📢 ${messageData.title}\n\n${messageData.content}`.trim();

      const resp = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: channelId,
          text: message
        }),
      });

      if (!resp.ok) {
        const t = await resp.text();
        console.error('Telegram error:', t);
        return res.status(500).send('Error sending message');
      }

      res.send('Message sent!');
    } catch (e) {
      console.error('Internal error:', e);
      res.status(500).send('Internal error');
    }
  }
);
