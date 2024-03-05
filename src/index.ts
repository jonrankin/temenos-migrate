import { MongoClient } from 'mongodb';
import { parseString, Builder } from "xml2js";

async function connectAndPrintDocuments() {
    const uri = 'ConnectionString'; // Replace with your MongoDB connection string
    const dbName = 'DB'; // Replace with your database name
    const collectionName = 'collectionName'; // Replace with your collection name

    const collection_out = `${collectionName}_out`
    const client = await MongoClient.connect(uri);
    try {

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const documents = await collection.find().toArray();



        documents.forEach(async (document) => {
            let data = {} as any
            const newDoc = parseString(documents[0].xml_value, { explicitArray: false }, function(error, result) {
                data = result
            }) ;

            await db.collection(collection_out).insertOne({
                recid: documents[0].recid,
                ...data.row
            })
            console.log(`Input ID: ${document.recid}`)
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {

    }
}

connectAndPrintDocuments();