import { db } from './db';

export class SubjectService {
  static async getSubjectTree(subjectId: string | number, userId: string | number) {
    const subject = await db('subjects').where({ id: subjectId }).first();
    if (!subject) throw new Error('Subject not found');

    const sections = await db('sections')
      .where({ subject_id: subjectId })
      .orderBy('order_index', 'asc');

    const videos = await db('videos')
      .whereIn('section_id', sections.map(s => s.id))
      .orderBy('order_index', 'asc');

    const progress = await db('video_progress')
      .where({ user_id: userId })
      .whereIn('video_id', videos.map(v => v.id));

    const progressMap = new Map(progress.map(p => [p.video_id, p]));
    let isPreviousCompleted = true;

    const tree = sections.map(section => {
      const sectionVideos = videos
        .filter(v => v.section_id === section.id)
        .map(video => {
          const videoProgress = progressMap.get(video.id);
          const isCompleted = videoProgress?.is_completed || false;
          const locked = !isPreviousCompleted;
          isPreviousCompleted = isCompleted;

          return {
            id: video.id,
            title: video.title,
            order_index: video.order_index,
            is_completed: isCompleted,
            locked,
            last_position: videoProgress?.last_position_seconds || 0
          };
        });

      return {
        id: section.id,
        title: section.title,
        order_index: section.order_index,
        videos: sectionVideos
      };
    });

    return {
      id: subject.id,
      title: subject.title,
      description: subject.description,
      sections: tree
    };
  }

  static async getVideoDetails(videoId: string | number, userId: string | number) {
    const video = await db('videos').where({ id: videoId }).first();
    if (!video) throw new Error('Video not found');

    const section = await db('sections').where({ id: video.section_id }).first();
    const subject = await db('subjects').where({ id: section.subject_id }).first();

    const allSections = await db('sections').where({ subject_id: subject.id }).orderBy('order_index', 'asc');
    const allVideos = await db('videos')
      .whereIn('section_id', allSections.map(s => s.id))
      .orderBy('section_id', 'asc')
      .orderBy('order_index', 'asc');

    const currentIndex = allVideos.findIndex(v => v.id === video.id);
    const prevVideo = allVideos[currentIndex - 1] || null;
    const nextVideo = allVideos[currentIndex + 1] || null;

    let locked = false;
    if (prevVideo) {
      const prevProgress = await db('video_progress')
        .where({ user_id: userId, video_id: prevVideo.id, is_completed: true })
        .first();
      if (!prevProgress) locked = true;
    }

    const currentProgress = await db('video_progress')
      .where({ user_id: userId, video_id: videoId })
      .first();

    return {
      ...video,
      section_title: section.title,
      subject_title: subject.title,
      prev_video_id: prevVideo?.id || null,
      next_video_id: nextVideo?.id || null,
      locked,
      current_progress: currentProgress || { last_position_seconds: 0, is_completed: false }
    };
  }
}
