import { json } from '@sveltejs/kit';
import { ProductModel } from '$lib/model/Product';
import { createPutHandler, createDeleteHandler } from '$lib/api/httpMethods';
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

export const PUT: RequestHandler = async ({ params, request }) => {
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

    const modifiedDocument = await ProductModel.findOneAndReplace(
      { _id: params.id },
      data,
      { new: true }
    );

    if (!modifiedDocument) {
      return json(
        { error: `Product with ID ${params.id} not found.` },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    return json(modifiedDocument, { status: StatusCodes.ACCEPTED });
  } catch (error) {
    console.error("Error creating:", error);

    return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};

export const DELETE = createDeleteHandler(ProductModel);





