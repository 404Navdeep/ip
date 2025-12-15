import { MongoClient } from "mongodb";

let client;
let db;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    if (!client) {
      client = new MongoClient(process.env.MONGO_URL);
      await client.connect();
      db = client.db("tracking");
    }

    const { ip, site } = req.body;

    await db.collection("ips").insertOne({
      ip,
      site,
      timestamp: new Date()
    });

    return res.status(200).json({ status: "saved" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
