import { json } from '@sveltejs/kit';
import { ProductModel, type Product } from '$lib/model/Product';
import { createDeleteHandler } from '$lib/api/httpMethods';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params
    const product = await ProductModel.findById(id);
    const description = await getGroqProductDescription(product);

    return json(description, { status: StatusCodes.OK });

  } catch (error) {
    console.error("Error fetching:", error);

    return json({ error: 'Could not fetch' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};

async function getGroqProductDescription(product: any) {

  return groq.chat.completions.create({

    messages: [
      {
        role: "user",

        content: "Generate a 3 sentence description, that will make user anxious to buy this product: {product}",

      },

    ],

    model: "openai/gpt-oss-20b",
  });
}
