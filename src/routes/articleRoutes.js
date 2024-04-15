import express from 'express';
import * as articleController from '../controllers/articleController.js';
import multer from 'multer';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

export default function articleRoutes(db) {
    const router = express.Router()

    router.post('/', upload.single('image'), (req, res) => {
        articleController.create(req, res, db)
    })

    router.get('/', (req, res) => {
        articleController.getAll(req, res, db)
    })

    router.get('/:id', (req, res) => {
        articleController.getById(req, res, db)
    })

    router.put('/:id', upload.single('image'), (req, res) => {
        articleController.update(req, res, db)
    })

    router.delete('/:id', (req, res) => {
        articleController.deleteFunc(req, res, db)
    })

    return router;
}
