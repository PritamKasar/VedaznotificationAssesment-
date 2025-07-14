const express = require('express');
const admin = require('firebase-admin');
const app = express();
const PORT = 4000;

const serviceAccount = require('./firebase-admin.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());


app.post('/send-notification', async (req, res) => {
  const { token, title, body } = req.body;

 const message = {
  token,
  notification: { title, body },
  data: { screen: 'Notification' }, 
};
  try {
    const response = await admin.messaging().send(message);
    res.send({ success: true, response });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
