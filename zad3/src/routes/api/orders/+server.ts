import { json } from '@sveltejs/kit';
import { OrderModel } from '$lib/model/Order';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

export const GET: RequestHandler = async () => {
  try {
    const orders = await OrderModel.find({});

    return json(orders, { status: StatusCodes.OK });
  } catch (error) {
    console.error("Error fetching:", error);

    return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();

    const createdOrder = await OrderModel.create(data);

    return json(createdOrder, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Error creating:", error);

    return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};
