import { ProductModel } from '$lib/model/Product';
import { createGetHandler, createPutHandler, createDeleteHandler } from '$lib/api/httpMethods';

export const GET = createGetHandler(ProductModel);

export const PUT = createPutHandler(ProductModel);

export const DELETE = createDeleteHandler(ProductModel);

