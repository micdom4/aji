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

export function createDeleteHandler<T>(CollectionModel: Model<T>): RequestHandler {
  return async ({ params }) => {
    try {
      const { id } = params;

      const deleted = await CollectionModel.findByIdAndDelete(id);

      return json(deleted, { status: StatusCodes.ACCEPTED });
    } catch (error) {
      console.error("Error creating:", error);

      return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
    }
  }
};

export function createPutHandler<T>(CollectionModel: Model<T>): RequestHandler {
  return async ({ params, request }) => {
    try {
      const data = await request.json();

      const modifiedDocument = await CollectionModel.findOneAndReplace(
        { _id: params.id },
        data,
        { new: true }
      );

      return json(modifiedDocument, { status: StatusCodes.ACCEPTED });
    } catch (error) {
      console.error("Error creating:", error);

      return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
    }
  }
};

