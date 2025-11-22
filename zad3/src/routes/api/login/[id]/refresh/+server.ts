import { json } from '@sveltejs/kit';
import { UserModel } from '$lib/model/User';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '$env/static/private';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return json({ error: 'Refresh token is required' }, { status: StatusCodes.UNAUTHORIZED });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return json({ error: 'Invalid refresh token' }, { status: StatusCodes.FORBIDDEN });
    }

    const user = await UserModel.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return json({ error: 'Invalid refresh token' }, { status: StatusCodes.FORBIDDEN });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return json({
      accessToken: newAccessToken
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    return json({ error: 'Server error' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};
