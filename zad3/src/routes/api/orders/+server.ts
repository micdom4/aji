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

    const { username, email, phoneNumber } = data;

    if (!username || !email || !phoneNumber) {
      return json(
        { error: 'fields username, email and phoneNumber cant be empty' },
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

    const { items } = data;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return json(
        { error: 'Order must contain at least one product.' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    for (const item of items) {
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        return json(
          {
            error: `Invalid quantity for product ${item.productId}. Quantity must be a positive number greater than zero.`
          },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
    }

    const productIdsToCheck = items.map((item: any) => item.productId);

    const foundProducts = await ProductModel.find({
      _id: { $in: productIdsToCheck }
    });

    for (const item of items) {
      const productExists = foundProducts.find(
        (p) => p._id.toString() === item.productId
      );

      if (!productExists) {
        return json(
          { error: `Product with ID ${item.productId} does not exist in the database.` },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
    }

    const createdOrder = await OrderModel.create(data);

    return json(createdOrder, { status: StatusCodes.CREATED });
  } catch (error) {
    console.error("Error creating:", error);

    return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};

