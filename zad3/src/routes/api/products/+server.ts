import { ProductModel } from '$lib/model/Product';
import { createGetAllHandler } from '$lib/api/httpMethods';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

export const GET = createGetAllHandler(ProductModel);

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();

    if (!data.name || !data.description) {
      return json(
        { error: 'Name and description cannot be empty.' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    if (data.unitPrice <= 0 || data.unitWeight <= 0) {
      return json(
        { error: 'Price and weight must be greater than zero.' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const createdOrder = await ProductModel.create(data);

    return json(createdOrder, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Error creating:", error);

    return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};

