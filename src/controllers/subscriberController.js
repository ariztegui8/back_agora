export const addSubscriber = async (req, res, db) => {
    const { nombre, apellido, email, profesion, empresa, pais } = req.body

    try {
        const result = await db.collection('subscribers').insertOne({
            nombre,
            apellido,
            email,
            profesion,
            empresa,
            pais,
            subscribedAt: new Date()
        })
        res.status(201).send({ message: 'Subscripcion exitosa', id: result.insertedId })
    } catch (error) {
        console.error('Error al agregar subscriptor', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}

export const listSubscribers = async (req, res, db) => {
    try {
        const subscribers = await db.collection('subscribers').find().toArray()
        res.status(200).send(subscribers)
    } catch (error) {
        console.error('Error al listar subscriptor', error)
        res.status(500).send({ error: 'Internal server error' })
    }
}