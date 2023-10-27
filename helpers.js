import { client } from "./index.js";


export async function updateLists(id, lists) {
    return await client.db("dresses").collection("dresses").updateOne({ id: id }, { $set: lists });
}
export async function addLists(newlists) {
    return await client.db("dresses").collection("dresses").insertMany(newlists);
}
export async function deleteListsById(id) {
    return await client.db("dresses").collection("dresses").deleteOne({ id: id });
}
export async function GetListsById(id) {
    return await client.db("dresses").collection("dresses").findOne({ id: id });
}
export async function getAllLists(req) {
    return await client.db("dresses").collection("dresses").find(req.query).toArray();
}
