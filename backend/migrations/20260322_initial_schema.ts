import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Users
  await knex.schema.createTable('users', (table) => {
    table.bigIncrements('id').primary();
    table.string('email').unique().notNullable().index();
    table.string('password_hash').notNullable();
    table.string('name').notNullable();
    table.timestamps(true, true);
  });

  // Subjects
  await knex.schema.createTable('subjects', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('slug').unique().notNullable().index();
    table.text('description');
    table.string('thumbnail_url');
    table.boolean('is_published').defaultTo(false);
    table.timestamps(true, true);
  });

  // Sections
  await knex.schema.createTable('sections', (table) => {
    table.increments('id').primary();
    table.integer('subject_id').unsigned().references('id').inTable('subjects').onDelete('CASCADE');
    table.string('title').notNullable();
    table.integer('order_index').notNullable().index();
    table.timestamps(true, true);
    table.unique(['subject_id', 'order_index']);
  });

  // Videos
  await knex.schema.createTable('videos', (table) => {
    table.increments('id').primary();
    table.integer('section_id').unsigned().references('id').inTable('sections').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('description');
    table.string('youtube_video_id').notNullable();
    table.integer('order_index').notNullable().index();
    table.integer('duration_seconds').nullable();
    table.timestamps(true, true);
    table.unique(['section_id', 'order_index']);
  });

  // Enrollments
  await knex.schema.createTable('enrollments', (table) => {
    table.increments('id').primary();
    table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('subject_id').unsigned().references('id').inTable('subjects').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'subject_id']);
  });

  // Progress tracking
  await knex.schema.createTable('video_progress', (table) => {
    table.increments('id').primary();
    table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('video_id').unsigned().references('id').inTable('videos').onDelete('CASCADE');
    table.integer('last_position_seconds').defaultTo(0);
    table.boolean('is_completed').defaultTo(false);
    table.timestamp('completed_at').nullable();
    table.timestamps(true, true);
    table.unique(['user_id', 'video_id']);
  });

  // Refresh tokens logic
  await knex.schema.createTable('refresh_tokens', (table) => {
    table.increments('id').primary();
    table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('token_hash').notNullable().index();
    table.timestamp('expires_at').notNullable();
    table.timestamp('revoked_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index(['user_id', 'token_hash']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('refresh_tokens');
  await knex.schema.dropTableIfExists('video_progress');
  await knex.schema.dropTableIfExists('enrollments');
  await knex.schema.dropTableIfExists('videos');
  await knex.schema.dropTableIfExists('sections');
  await knex.schema.dropTableIfExists('subjects');
  await knex.schema.dropTableIfExists('users');
}
