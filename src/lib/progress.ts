import { db } from './db';

export class ProgressService {
  static async updateProgress(userId: number, videoId: number, last_position: number, is_completed: boolean = false) {
    const video = await db('videos').where({ id: videoId }).first();
    if (!video) throw new Error('Video not found');

    const cappedPosition = video.duration_seconds
      ? Math.min(Math.max(0, last_position), video.duration_seconds)
      : Math.max(0, last_position);

    const existingRow = await db('video_progress')
      .where({ user_id: userId, video_id: videoId })
      .first();

    if (existingRow) {
      const newIsCompleted = is_completed || existingRow.is_completed;
      await db('video_progress')
        .where({ id: existingRow.id })
        .update({
          last_position_seconds: cappedPosition,
          is_completed: newIsCompleted,
          completed_at: newIsCompleted && !existingRow.is_completed ? db.fn.now() : existingRow.completed_at,
          updated_at: db.fn.now()
        });
    } else {
      await db('video_progress').insert({
        user_id: userId,
        video_id: videoId,
        last_position_seconds: cappedPosition,
        is_completed,
        completed_at: is_completed ? db.fn.now() : null
      });
    }

    const section = await db('sections').where({ id: video.section_id }).first();
    return this.getSubjectProgress(userId, section.subject_id);
  }

  static async getSubjectProgress(userId: number, subjectId: number) {
    const sections = await db('sections').where({ subject_id: subjectId }).pluck('id');
    const videos = await db('videos').whereIn('section_id', sections).select('id');
    const totalVideos = videos.length;

    const progress = await db('video_progress')
      .where({ user_id: userId, is_completed: true })
      .whereIn('video_id', videos.map(v => v.id))
      .count('* as completed')
      .first();

    const lastAction = await db('video_progress')
       .where({ user_id: userId })
       .whereIn('video_id', videos.map(v => v.id))
       .orderBy('updated_at', 'desc')
       .first();

    const completed = parseInt(String(progress?.completed || '0'), 10);
    const percent_complete = totalVideos > 0 ? Math.round((completed / totalVideos) * 100) : 0;

    return {
      total_videos: totalVideos,
      completed_videos: completed,
      percent_complete,
      last_video_id: lastAction?.video_id || null,
      last_position_seconds: lastAction?.last_position_seconds || 0
    };
  }
}
