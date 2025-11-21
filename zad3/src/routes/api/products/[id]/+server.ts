import { json } from '@sveltejs/kit';
import { ProductModel, type Product } from '$lib/model/Product';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { createGetHandler } from '$lib/api/httpMethods';


export const GET = createGetHandler(ProductModel);

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const data = await request.json() as Product;

    const modifiedProduct = await ProductModel.findOneAndReplace(
      { _id: params.id },
      data,
      { new: true }
    );

    return json(modifiedProduct, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Error creating:", error);

    return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};

