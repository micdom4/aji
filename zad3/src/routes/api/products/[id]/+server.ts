import { json } from '@sveltejs/kit';
import { ProductModel, type Product } from '$lib/model/Product';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { error } from 'console';


export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;

    const product = await ProductModel.findById(id);

    if (!product) {
      return json(error("Product not found", StatusCodes.NOT_FOUND));
    }

    return json(product, { status: StatusCodes.OK });
  } catch (error) {
    console.error("Error fetching tasks:", error);

    return json({ error: 'Could not fetch tasks' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};

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

