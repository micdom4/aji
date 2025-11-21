import { ProductModel } from '$lib/model/Product';
import { createGetAllHandler } from '$lib/api/httpMethods';

export const GET = createGetAllHandler(ProductModel);
