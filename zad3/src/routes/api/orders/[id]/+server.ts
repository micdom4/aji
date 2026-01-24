import { json } from '@sveltejs/kit';
import { OrderModel, State } from '$lib/model/Order';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { createGetAllHandler } from '$lib/api/httpMethods';

const STATE_HIERARCHY = [State.UNACCEPTED, State.ACCEPTED, State.CANCELED, State.REALIZED];


export const GET = createGetAllHandler(OrderModel);

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const data = await request.json();
    const order = await OrderModel.findById(params.id);

    if (!order) {
      return json(
        { error: `Order with id ${params.id} does not exist.` },
        { status: StatusCodes.NOT_FOUND }
      );
    }
    if (order.state.name === 'CANCELED') {
      return json(
        { error: 'Cannot change status of an order that has already been canceled.' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const currentState = order.state.name;
    const newState = data.state.name;

    const oldIndex = STATE_HIERARCHY.indexOf(currentState);
    const newIndex = STATE_HIERARCHY.indexOf(newState);

    if (oldIndex === -1 || newIndex === -1) {
      return json(
        { error: 'Invalid state provided or current state cannot be transitioned linearly.' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    if (newIndex < oldIndex) {
      return json(
        {
          error: `Cannot revert status backwards from ${currentState} to ${newState}.`
        },
        { status: StatusCodes.BAD_REQUEST }
      );
    }


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

    const modifiedDocument = await OrderModel.findOneAndReplace(
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
