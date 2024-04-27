
import express from "express";
import webpush from "web-push";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';
dotenv.config();


const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "client")))


  const publicKey= process.env.VAPID_PUBLIC_KEY
  const privateKey= process.env.VAPID_PRIVATE_KEY


const port=process.env.PORT


webpush.setVapidDetails(
  "mailto:gautamdb28@example.com",
  publicKey,
 privateKey
)

let subscriptions = [];

app.get("/", (req, res)=>{
  res.send("Push notification")
})

app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);

  res.status(201).json({status: "success"});
});

app.post("/send-notification", (req, res) => {
  const notificationPayload = {
    title: 'Notifications are cool',
    body: 'Know how to send notifications through Angular with this article!',
    icon: 'https://www.shareicon.net/data/256x256/2015/10/02/110808_blog_512x512.png',
    vibrate: [100, 50, 100],
    data: {
      url: 'https://medium.com/@arjenbrandenburgh/angulars-pwa-swpush-and-swupdate-15a7e5c154ac'
    },
  };

  Promise.all(
    subscriptions.map((subscription) =>
      webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
    )
  )
    .then(() => res.status(200).json({ message: "Notification sent successfully." }))
    .catch((err) => {
      console.error("Error sending notification");
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});