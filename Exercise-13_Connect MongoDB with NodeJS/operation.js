const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'my_database';
const collectionName = 'articles';

const client = new MongoClient(url);

async function connectDB() {
  await client.connect();
  console.log('Connected successfully to MongoDB');

  const db = client.db(dbName);
  return db.collection(collectionName);
}

// CREATE
async function createArticle() {
  const collection = await connectDB();

  const result = await collection.insertOne({
    title: 'NodeJS with MongoDB',
    author: 'Nguyen Van A',
    content: 'This is an article about connecting MongoDB with NodeJS',
    tags: ['nodejs', 'mongodb'],
    category: 'Technology',
    createdAt: new Date()
  });

  console.log('Inserted document:', result.insertedId);
  await client.close();
}

// READ
async function getArticles() {
  const collection = await connectDB();

  const articles = await collection.find({}).toArray();

  console.log('Articles:', articles);
  await client.close();
}

// UPDATE
async function updateArticle(id) {
  const collection = await connectDB();

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: 'Updated NodeJS with MongoDB',
        updatedAt: new Date()
      }
    }
  );

  console.log('Updated count:', result.modifiedCount);
  await client.close();
}

// DELETE
async function deleteArticle(id) {
  const collection = await connectDB();

  const result = await collection.deleteOne({
    _id: new ObjectId(id)
  });

  console.log('Deleted count:', result.deletedCount);
  await client.close();
}

module.exports = {
  createArticle,
  getArticles,
  updateArticle,
  deleteArticle
};
