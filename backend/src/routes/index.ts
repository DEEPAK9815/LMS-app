import { Router } from 'express';
import { register, login, refresh, logout } from '../modules/auth/auth.controller.js';
import { listSubjects, getTree, getVideo, updateProgress, getSubjectProgress } from '../modules/subjects/subjects.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);

// Subjects - Public-ish (metadata)
router.get('/subjects', listSubjects);

// Subjects & Videos - Needs Auth
router.get('/subjects/:id/tree', authenticate as any, getTree as any);
router.get('/videos/:id', authenticate as any, getVideo as any);

// Progress - Needs Auth
router.get('/progress/subjects/:id', authenticate as any, getSubjectProgress as any);
router.post('/progress/videos/:videoId', authenticate as any, updateProgress as any);

export { router };
