import { json } from '@sveltejs/kit';
import { OrderModel } from '$lib/model/Order';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const data = await request.json();
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
