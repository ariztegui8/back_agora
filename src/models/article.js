import { ObjectId } from 'mongodb'

export const createArticle = async (db, data) => {
  const collection = db.collection('articles')
  return await collection.insertOne(data)
}

export const getAllArticles = async (db) => {
  const collection = db.collection('articles')
  return await collection.find({}).toArray()
}

export const getArticleById = async (db, id) => {
  const collection = db.collection('articles');
  return await collection.findOne({ _id: new ObjectId(id) })
}

export const updateArticle = async (db, id, data) => {
  const collection = db.collection('articles')
  return await collection.updateOne({ _id: new ObjectId(id) }, { $set: data })
}

export const deleteArticle = async (db, id) => {
  const collection = db.collection('articles')
  return await collection.deleteOne({ _id: new ObjectId(id) })
}