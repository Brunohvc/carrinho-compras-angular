import express from 'express';
import BaseController from '../../config/base/base-controller';
import handler from './productsHandler';

const router = express.Router();
const controller = BaseController({ router, handler, madeBasicRoutes: true });



export default router;