import clientPromise from "@/lib/mongodb";
export async function GET() {
const client = await clientPromise;
const db = client.db("next.js-course");
const data = await db.collection("chat").findOne({}).toArray();
return response.json({ message: "DB connect successfully" });
}
