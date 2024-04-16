import { createArticle, getAllArticles, getArticleById, updateArticle, deleteArticle } from '../models/article.js';
import { ObjectId } from 'mongodb';

export const create = async (req, res, db) => {
    try {
        const image = req.file ? req.file.path : 'uploads/default.svg'
        const { title, description, category, author, video } = req.body

        const result = await createArticle(db, { title, description, category, image, author, video })
        if (result.acknowledged) {
            const total = await db.collection('articles').countDocuments()
            const totalPages = Math.ceil(total / 12)

            res.status(201).send({
                message: "Artículo creado exitosamente",
                articleId: result.insertedId,
                imagePath: image,
                currentPage: Math.ceil(total / 12),
                totalPages: totalPages
            })

        } else {
            res.status(400).send({ error: "No se pudo crear el artículo" })
        }
    } catch (error) {
        console.error('Error al crear artículo', error)
        res.status(500).send({ error: 'Error interno del servidor' })
    }
}

export const getAll = async (req, res, db) => {
    const { search, sort, page = 1, limit = 12 } = req.query
    const skip = (page - 1) * limit

    let query = {}
    if (search) {
        query = {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        }
    }

    let sortOrder = {}
    if (sort === 'ASC') {
        sortOrder = { title: 1 }
    } else if (sort === 'DEC') {
        sortOrder = { title: -1 }
    }

    try {
        const articles = await db.collection('articles')
            .find(query)
            .sort(sortOrder)
            .skip(skip)
            .limit(parseInt(limit))
            .toArray()

        const total = await db.collection('articles').countDocuments(query)

        res.status(200).send({
            articles,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        console.error('Error al obtener artículos', error)
        res.status(500).send({ error: 'Error interno del servidor' })
    }
}

export const getById = async (req, res, db) => {
    try {
        const article = await getArticleById(db, req.params.id)
        if (article) {
            res.status(200).send(article)
        } else {
            res.status(404).send({ message: "Artículo no encontrado" })
        }
    } catch (error) {
        console.error('Error al obtener el artículo', error)
        res.status(500).send({ error: 'Error interno del servidor' })
    }
}

export const update = async (req, res, db) => {
    console.log('body', req.body)
    console.log('file', req.file)
    const { id } = req.params
    const { title, description, category, author, video } = req.body

    const data = {}
    if (title) data.title = title
    if (description) data.description = description
    if (category) data.category = category
    if (author) data.author = author
    if (video) data.video = video
    if (req.file) data.image = req.file.path

    console.log("Datos recibidos para actualizar", data)

    try {
        const result = await db.collection('articles').updateOne({ _id: new ObjectId(id) }, { $set: data })
        if (result.modifiedCount === 1) {
            const updatedArticle = await db.collection('articles').findOne({ _id: new ObjectId(id) })
            if (updatedArticle) {
                res.status(200).send(updatedArticle)
            } else {
                res.status(404).send({ message: "Artículo actualizado pero no encontrado" })
            }
        } else {
            res.status(404).send({ message: "Artículo no encontrado o sin cambios" })
        }
    } catch (error) {
        console.error('Error al actualizar artículo', error)
        res.status(500).send({ error: 'Error interno del servidor' })
    }
}

export const deleteFunc = async (req, res, db) => {
    const { id } = req.params

    if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "ID no válido" })
    }

    try {
        const result = await db.collection('articles').deleteOne({ _id: new ObjectId(id) })
        if (result.deletedCount === 1) {
            res.status(200).send({ message: "Artículo eliminado exitosamente" })
        } else {
            res.status(404).send({ message: "Artículo no encontrado" })
        }
    } catch (error) {
        console.error('Error al eliminar artículo', error);
        res.status(500).send({ error: 'Error interno del servidor' })
    }
}
