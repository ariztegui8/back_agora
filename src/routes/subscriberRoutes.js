import express from 'express';
import { addSubscriber, listSubscribers } from '../controllers/subscriberController.js';

const router = express.Router()

const subscriberRoutes = (db) => {
  router.post('/', (req, res) => addSubscriber(req, res, db))
  router.get('/', (req, res) => listSubscribers(req, res, db))
  return router
}

export default subscriberRoutes;