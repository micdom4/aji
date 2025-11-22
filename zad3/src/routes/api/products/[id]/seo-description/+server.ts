import { json } from '@sveltejs/kit';
import { ProductModel } from '$lib/model/Product';
import { createDeleteHandler } from '$lib/api/httpMethods';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params
    const product = await ProductModel.findById(id);

    return json(product, { status: StatusCodes.OK });

  } catch (error) {
    console.error("Error fetching:", error);

    return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};
