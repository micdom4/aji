import { ProductModel } from '$lib/model/Product';
import { createGetAllHandler, createPostHandler } from '$lib/api/httpMethods';

export const GET = createGetAllHandler(ProductModel);

export const POST = createPostHandler(ProductModel);

