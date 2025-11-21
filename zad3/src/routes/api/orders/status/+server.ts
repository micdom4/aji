import { json } from '@sveltejs/kit';
import { OrderStateModel } from '$lib/model/Order';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

export const GET: RequestHandler = async () => {
  try {
    const statuses = await OrderStateModel.find({})

    return json(statuses, { status: StatusCodes.OK });
  } catch (error) {
    console.error("Error creating:", error);

    return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};
