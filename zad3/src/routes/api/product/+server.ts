import { json } from '@sveltejs/kit';
import { ProductModel } from '$lib/model/Product';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

export const GET: RequestHandler = async () => {
  try {
    const products = await ProductModel.find({});

    return json(products, { status: StatusCodes.OK });
  } catch (error) {
    console.error("Error fetching tasks:", error);

    return json({ error: 'Could not fetch tasks' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};
