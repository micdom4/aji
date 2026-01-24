import { json } from '@sveltejs/kit';
import { OrderModel } from '$lib/model/Order';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const orderWithGivenStatus = await OrderModel.find({ "state._id": params.id })

    return json(orderWithGivenStatus, { status: StatusCodes.OK });
  } catch (error) {
    console.error("Error creating:", error);

    return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};
