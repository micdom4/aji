import { json } from '@sveltejs/kit';
import { OrderModel } from '$lib/model/Order';
import { ProductModel } from '$lib/model/Product';
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

    const { username, email, phoneNumber, productList } = data;

    if (!username || !email || !phoneNumber) {
      return json(
        { error: 'Fields username, email and phoneNumber cannot be empty' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const phoneRegex = /^[0-9+\-\s]+$/;

    if (!phoneRegex.test(phoneNumber)) {
      return json(
        { error: 'Phone number is invalid' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    if (!productList || !Array.isArray(productList) || productList.length === 0) {
      return json(
        { error: 'Order must contain at least one product in productList.' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const productIdsToCheck = productList.map((item: any) => item._id);

    const foundProducts = await ProductModel.find({
      _id: { $in: productIdsToCheck }
    });

    for (const item of productList) {
      if (!item._id) {
        return json(
          { error: `Product object is missing an _id field.` },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      const productExists = foundProducts.find(
        (p) => p._id.toString() === item._id
      );

      if (!productExists) {
        return json(
          { error: `Product with ID ${item._id} does not exist in the database.` },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
    }

    const createdOrder = await OrderModel.create(data);

    return json(createdOrder, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Error creating:", error);

    return json({ error: 'Could not process request' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};
