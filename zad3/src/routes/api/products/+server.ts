import { json } from '@sveltejs/kit';
import { ProductModel, type Product } from '$lib/model/Product';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

export const GET: RequestHandler = async () => {
  try {
    const products = await ProductModel.find({});

    return json(products, { status: StatusCodes.OK });
  } catch (error) {
    console.error("Error fetching:", error);

    return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json() as Product;

    const createdProduct = ProductModel.create(data);

    return json(createdProduct, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Error creating:", error);

    return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};

