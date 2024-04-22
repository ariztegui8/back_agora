import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import articleRoutes from './routes/articleRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

const urlMongo = `${process.env.MONGO_URL}?retryWrites=true&w=majority`

const client = new MongoClient(urlMongo)

async function main() {
  try {
    await client.connect()
    console.log('Conectado a la base de datos')
    const db = client.db('shifts')

    app.use('/api/articles', articleRoutes(db))
    app.use('/api/subscribers', subscriberRoutes(db))

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`)
    })
  } catch (error) {
    console.error('Error conectando a la base de datos:', error)
    process.exit(1)
  }
}

main()
