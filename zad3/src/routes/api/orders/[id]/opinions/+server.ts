import { json } from '@sveltejs/kit';
import { OrderModel } from '$lib/model/Order';
import { UserModel } from '$lib/model/User';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

export const POST: RequestHandler = async ({ params, request, locals }) => {
  const { id } = params;

  if (!locals.user) {
    return json(
      { error: 'Unauthorized. Please login to add an opinion.' },
      { status: StatusCodes.UNAUTHORIZED }
    );
  }

  try {
    const body = await request.json();
    const { rating, content } = body;

    if (!rating || !content) {
      return json(
        { error: 'Required fields: rating, content.' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return json(
        { error: 'Rating must be an integer between 1 and 5.' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const order = await OrderModel.findById(id);

    if (!order) {
      return json(
        { error: 'Order not found.' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    const currentUser = await UserModel.findById(locals.user.userId);

    if (!currentUser || currentUser.username !== order.username) {
      return json(
        { error: 'You cannot add an opinion to an order that is not yours.' },
        { status: StatusCodes.FORBIDDEN }
      );
    }

    const allowedStates = ['REALIZED', 'CANCELED'];

    if (!allowedStates.includes(order.state.name)) {
      return json(
        { error: `Cannot add opinion. Required status: REALIZED or CANCELED. Current status: ${order.state.name}` },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    order.opinions.push({
      rating,
      content,
      createdAt: new Date()
    });

    await order.save();

    return json(
      { message: 'Opinion added successfully.' },
      { status: StatusCodes.CREATED }
    );

  } catch (error) {
    return json(
      { error: 'Server error or invalid ID format.' },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
};
