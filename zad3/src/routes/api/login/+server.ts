import { json } from '@sveltejs/kit';
import { UserModel } from '$lib/model/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '$env/static/private';
import { StatusCodes } from 'http-status-codes';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { username, password } = await request.json();

    const user = await UserModel.findOne({ username });
    if (!user) {
      return json({ error: 'Invalid login credentials' }, { status: StatusCodes.UNAUTHORIZED });
    }

    if (password !== user.password) {
      return json({ error: 'Invalid login credentials' }, { status: StatusCodes.UNAUTHORIZED });
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return json({
      message: 'Logged in successfully',
      accessToken,
      refreshToken,
      role: user.role
    });

  } catch (error) {
    console.error('Login error:', error);
    return json({ error: 'Server error occurred' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};
