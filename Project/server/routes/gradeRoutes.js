const express = require('express');
const { listSubmissions, createGrade } = require('../controllers/gradeController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authenticate);           
router.get('/submissions', listSubmissions);
router.post('/', createGrade);

module.exports = router;