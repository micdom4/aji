import { json } from '@sveltejs/kit';
import { OrderModel } from '$lib/model/Order';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

export const PUT: RequestHandler = async ({ params, request }) => {
  try {

    const order = await OrderModel.findById(params.id);

    if (!order) {
      return json(
        { error: `Order with id ${params.id} does not exist.` },
        { status: StatusCodes.NOT_FOUND }
      );
    }
    if (order.state.name === 'CANCELED') {
      return json(
        { error: 'Cannot change status of an order that has already been canceled.' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const data = await request.json();

    const { username, email, phoneNumber } = data;

    if (!username || !email || !phoneNumber) {
      return json(
        { error: 'fields username, email and phoneNumber cant be empty' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const phoneRegex = /^[0-9+\-\s]+$/;

    if (!phoneRegex.test(phoneNumber)) {
      return json(
        { error: 'Phone number is invalid' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const modifiedDocument = await OrderModel.findOneAndReplace(
      { _id: params.id },
      data,
      { new: true }
    );

    return json(modifiedDocument, { status: StatusCodes.ACCEPTED });
  } catch (error) {
    console.error("Error creating:", error);

    return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};
