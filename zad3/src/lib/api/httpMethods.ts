import { json } from '@sveltejs/kit';
import { StatusCodes } from 'http-status-codes';
import type { RequestHandler } from '@sveltejs/kit';
import { type Model } from 'mongoose';

export function createGetAllHandler<T>(CollectionModel: Model<T>): RequestHandler {
  return async ({ url, params }) => {
    try {
      const documents = await CollectionModel.find({});

      return json(documents, { status: StatusCodes.OK });
    } catch (error) {
      console.error(`Error fetching from ${CollectionModel.modelName}:`, error);
      return json(
        { error: 'Could not fetch data' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }
  };
}

export function createGetHandler<T>(CollectionModel: Model<T>): RequestHandler {
  return async ({ url, params }) => {
    try {
      const { id } = params;
      const document = await CollectionModel.findById(id);

      return json(document, { status: StatusCodes.OK });
    } catch (error) {
      console.error(`Error fetching from ${CollectionModel.modelName}:`, error);
      return json(
        { error: 'Could not fetch data' },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }
  };
}

export function createPostHandler<T>(CollectionModel: Model<T>): RequestHandler {
  return async ({ params, request }) => {
    try {
      const data = await request.json();

      const createdProduct = CollectionModel.create(data);

      return json(createdProduct, { status: StatusCodes.CREATED });
    } catch (error) {
      console.error("Error creating:", error);

      return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
    }
  }
};

