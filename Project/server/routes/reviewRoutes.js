import express from 'express';
import {
  createReview,
  getInstructorReviews,
  getPublicReviews,
  markHelpful,
} from '../controllers/reviewController.js';
import { protect, parentOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, parentOnly, createReview);

router.route('/instructor/:id')
  .get(getInstructorReviews);

router.route('/public')
  .get(getPublicReviews);

router.route('/:id/helpful')
  .put(protect, parentOnly, markHelpful);

export default router;
