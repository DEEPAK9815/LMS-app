import { Request, Response } from 'express';
import { SubjectService } from './subjects.service.js';
import { ProgressService } from '../progress/progress.service.js';
import { AuthRequest } from '../../middleware/authMiddleware.js';
import { db } from '../../config/db.js';

export const listSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await db('subjects').where({ is_published: true }).orderBy('created_at', 'desc');
    res.json(subjects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTree = async (req: AuthRequest, res: Response) => {
  try {
    const tree = await SubjectService.getSubjectTree(req.params.id, req.user!.id);
    res.json(tree);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const getVideo = async (req: AuthRequest, res: Response) => {
  try {
    const video = await SubjectService.getVideoDetails(req.params.id, req.user!.id);
    res.json(video);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { last_position, is_completed } = req.body;
    const progress = await ProgressService.updateProgress(
      req.user!.id,
      parseInt(req.params.videoId, 10),
      last_position,
      is_completed
    );
    res.json(progress);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getSubjectProgress = async (req: AuthRequest, res: Response) => {
  try {
    const progress = await ProgressService.getSubjectProgress(req.user!.id, parseInt(req.params.id, 10));
    res.json(progress);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
