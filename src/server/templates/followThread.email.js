import config from 'config';
import React from 'react';
import Layout from './email.layout';
import { get } from 'lodash';

export const subject = ({ post }) => {
  return `You are now following the thread ${post.title}`;
};

export const previewText = ({ post }) => {
  return `You will now receive all new replies to ${post.title}`;
};

export const body = data => {
  const { groupSlug, post, url } = data;
  return (
    <Layout data={data}>
      <p>
        You are now following the <a href={url}>{post.title}</a> thread. All new replies sent to ${groupSlug}/$
        {post.PostId}@${get(config, 'server.domain')} will now also be sent to you.
      </p>
      <p>If this is an error, click on the link below to unfollow this thread.</p>
    </Layout>
  );
};
