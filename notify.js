// ═══════════════════════════════════════════
//  api/notify.js
//  Vercel Serverless Function
//  Sends FCM push notifications
// ═══════════════════════════════════════════

const { GoogleAuth } = require('google-auth-library');

const SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "wholesale-realtors-chat",
  "private_key_id": "c8852c70cae07bf91713dd80cc4f2b79554fcfc2",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCt+Nn1/pxvnDo5\n7Qn+7jfJHjVR0v1uNWllb982o2cu6ex7y35eC6Q5A/4BPqw/tCbFWcJc0P1l3yzo\nV8dLNy9GL/RPO5cotyaaUM0l6Id7sFquFAhRvUbwdjI8fTIPQUr9GWHGTeiLMYdr\ne/NrG03RhNJwbhYvWK9ZgadDmunh/kNiE/9kkmxURu96nr29qy1u+9tQoeoKMSfm\noruJxAt0SJs9tyf03q8QW3CHqHwEyb/xuBdAzHtJi1keGwfAUkGi8fEZ70hGr0mJ\nj2eOlRzBF8FAZ2yAzMUJ7vAQmDVBYcO73yeCEfFkEyhQ/Apl6l5+zUXA9bJKbl06\nI69y/Aa/AgMBAAECggEAAfyFUWOiwDvkIE6YEblnmQ8t8OBVwdqwEhciaqD+Z+ps\n2ro0MayBWtNN8anlCDJgfo1e6w9jbU4/vx4z3NeyKjBLyLtqwO2POvpxAgQZk+x4\nd8qSKiWQOBh2MpTQkjY4V6zg0Ti8TuaPky2Bouq9yzm9Uci4ASD9zSnuHn2YB3TX\nPGgtGCtfBfCT4BQKGzvCbZaFT05GdyyvRPR1ZuiN/L48yLjrzCKVpT9XloNYqpWB\ny3UyAD/SgBDqsp4lLZFk2cuyWxeOjFCYlY+C9DTsPzCn650fLz7iIvH3Uwntt1S1\n5QNIfetjgXm5VI+JvRkEBf/+cCP+baRba+c2L1CmkQKBgQDiM0P/RFjkpxYNlgfS\njzgz9ss2O3zAMOnEx8GYFpkSWl+9Oh9GqMJ25kDvln7ekqAx2D2j3MXXL5g7TmbL\nhAvBFAUrBB67qrvF691Iw3n+TBOYKxN4FU0SAniTLYg798gApCndWsMjPF7Qbf2u\nvnSfMC+F0ITSlSm3/xZg5bfSzwKBgQDE5CkESLU9MhmUYttYfpUqESFRs511cBAw\npWMWDO0nzMFyb0DOfw5wZW3ukasTdozpJY7jhMrBSYf6+Qzgi7j/5Q045plr+1Do\n/2dLzwOQRbOf37R/mdTSdY1UKVj+xm1QPRu3JgO0KsX1va4q/nlMSOWl5JfRBPNF\nLhvigTZJEQKBgEpJUdR8isEVCo4NrqX8+RU/wL8fzDmGFs/UVoTvLvgzC+wmMW1Q\nMQVBWyQUBbhs6QVVofC1qZeg/trDRckipYWUYJoe8UTqrl4ytuqVn/Pe4jSAORWf\n0T7P5u9W7b3cAygKweD7VMi2o+DJrp172OsKtSC6OVS7Pgc6VAwghT1LAoGAT2Td\nsU+MXdfk/rP6VS3+Ak+UCvkNxnxg2uzmDs85lnH3k6iPDnWnoeUUtj3hKWEFo0I0\n40P56oU3Ixnoemd9OxrnAQnj1eoqjznmMmiQvE2PCCnSBB5I9nDWg5iEvX/QNqnd\nkjXvCmixGM3a/JVO3lcK26FZIr0HR982+Vg3RrECgYAXkT1pbrNvEvgoVZsvwXjr\npEx/UcS1jqlQSc/H5eHjLZOCS8o1SwdCYyAYLUDUnhG3ZhBI90guejkpoPyBIuqJ\n8dyoSTbUzb3/aJbodYGBfo/zrZ5ZmKBM44KRvM1Ip7hniJxfGS9SEVA6pVzrlT/l\ndWwC+htbITSjisAO2nGrYA==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@wholesale-realtors-chat.iam.gserviceaccount.com",
  "client_id": "117851876042407767971",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40wholesale-realtors-chat.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

async function getAccessToken() {
  const auth = new GoogleAuth({
    credentials: SERVICE_ACCOUNT,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging']
  });
  const client = await auth.getClient();
  const token  = await client.getAccessToken();
  return token.token;
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token, title, body, chatCode } = req.body;
  if (!token || !body) return res.status(400).json({ error: 'Missing token or body' });

  try {
    const accessToken = await getAccessToken();
    const projectId   = SERVICE_ACCOUNT.project_id;

    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
      {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type':  'application/json'
        },
        body: JSON.stringify({
          message: {
            token,
            notification: { title: title || 'Wholesale Realtors Chat', body },
            data: { chatCode: chatCode || '' },
            webpush: {
              notification: {
                title: title || 'Wholesale Realtors Chat',
                body,
                icon: '/icon.png',
                badge: '/icon.png',
                requireInteraction: true
              },
              fcm_options: { link: `/chat.html?code=${chatCode||''}` }
            }
          }
        })
      }
    );

    const result = await response.json();
    if (result.error) return res.status(500).json({ error: result.error.message });
    return res.status(200).json({ success: true, messageId: result.name });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
