import { connectMongo } from "$lib/server/database";
import { type Handle, json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { StatusCodes } from 'http-status-codes';

connectMongo();

export const handle: Handle = async ({ event, resolve }) => {
  const authHeader = event.request.headers.get('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      event.locals.user = {
        userId: decoded.userId,
        role: decoded.role
      };

    } catch (err) {
      console.error('Token verification error:', err);
    }
  }

  if (event.url.pathname.startsWith('/api/products') && !event.locals.user) {
    return json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED });
  }

  if (event.url.pathname.startsWith('/api/init') && !event.locals.user) {
    return json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED });
  }

  return await resolve(event);
};
