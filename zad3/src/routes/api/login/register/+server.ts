import { json } from '@sveltejs/kit';
import { UserModel, UserRole } from '$lib/model/User';
import { StatusCodes } from 'http-status-codes';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { username, password } = await request.json();

		if (!username || !password) {
			return json(
				{ error: 'Username and password are required' },
				{ status: StatusCodes.BAD_REQUEST }
			);
		}

		const existingUser = await UserModel.findOne({ username });
		if (existingUser) {
			return json(
				{ error: 'User with this username already exists' },
				{ status: StatusCodes.CONFLICT }
			);
		}

		const newUser = await UserModel.create({
			username,
			password,
			role: UserRole.CLIENT
		});

		return json(
			{
				message: 'User registered successfully',
				userId: newUser._id
			},
			{ status: StatusCodes.CREATED }
		);
	} catch (error) {
		console.error('Registration error:', error);
		return json(
			{ error: 'Server error occurred during registration' },
			{ status: StatusCodes.INTERNAL_SERVER_ERROR }
		);
	}
};
