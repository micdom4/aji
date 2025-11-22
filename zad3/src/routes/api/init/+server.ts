import { json } from '@sveltejs/kit';
import { ProductModel, CategoryModel } from '$lib/model/Product';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized: Please login first' }, { status: StatusCodes.UNAUTHORIZED });
  }

  try {
    const count = await ProductModel.countDocuments();
    if (count > 0) {
      return json(
        { error: 'Database is already initialized. Cannot overwrite existing data.' },
        { status: StatusCodes.CONFLICT }
      );
    }

    const items = await request.json();

    if (!Array.isArray(items)) {
      return json({ error: 'Input must be a JSON array of products' }, { status: StatusCodes.BAD_REQUEST });
    }

    const productsToInsert = [];

    for (const item of items) {
      const category = await CategoryModel.findOne({ name: item.categoryName });

      if (!category) {
        return json(
          { error: `Category not found: '${item.categoryName}'. Please create categories first.` },
          { status: StatusCodes.BAD_REQUEST }
        );
      }

      productsToInsert.push({
        name: item.name,
        description: item.description,
        unitPrice: item.unitPrice,
        unitWeight: item.unitWeight,
        category: {
          _id: category._id,
          name: category.name
        }
      });
    }

    await ProductModel.insertMany(productsToInsert);

    return json({ message: 'Database initialized successfully', count: productsToInsert.length }, { status: StatusCodes.OK });

  } catch (error) {
    console.error('Init error:', error);
    return json({ error: 'Internal Server Error' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};
