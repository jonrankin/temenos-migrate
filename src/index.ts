import { MongoClient } from 'mongodb';
import { parseString, Builder } from "xml2js";
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.URI as string // Replace with your MongoDB connection string
const dbName = process.env.DB as string  // Replace with your database name
const collectionName = process.env.COLLECTION as string// Replace with your collection name

if (!uri) { throw new Error("Environment variable URI is not set"); }
if (!dbName) { throw new Error("Environment variable DB is not set"); }
if (!collectionName) { throw new Error("Environment variable COLLECTION is not set"); }

async function connectAndPrintDocuments() {


    const collection_out = `${collectionName}_out`
    const client = await MongoClient.connect(uri);
    try {

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const documents = await collection.find().toArray();


        // const newDoc = await parseString(documents[0].xml_value, { explicitArray: false, ignoreAttrs: true }, function(error, result) {
        //     console.log(result.row)
        // })

        documents.forEach(async (document) => {
            let data = {} as any
            const newDoc = await parseString(document.xml_value, { explicitArray: false, ignoreAttrs: true }, function(error, result) {
                data = result
            }) ;
            if(data) {
                await db.collection(collection_out).insertOne({
                    recid: document.recid,
                    ...data.row
                })
            }
            console.log('Document Inserted:', document.recid)
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {

    }
}

connectAndPrintDocuments();