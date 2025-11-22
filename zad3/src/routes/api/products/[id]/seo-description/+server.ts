import { json } from '@sveltejs/kit';
import { ProductModel } from '$lib/model/Product';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { GROQ_API_KEY } from '$env/static/private';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: GROQ_API_KEY });

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { id } = params;

    const product = await ProductModel.findById(id).lean();

    if (!product) {
      return json({ error: 'Product not found' }, { status: StatusCodes.NOT_FOUND });
    }

    const descriptionText = await getGroqProductDescription(product);

    return json({ description: descriptionText }, { status: StatusCodes.OK });

  } catch (error) {
    console.error("Error fetching product description:", error);
    return json({ error: 'Could not generate description' }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};

async function getGroqProductDescription(product: any) {
  const productContext = JSON.stringify(product);

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Generate a 3 sentence description, that will make user anxious to buy this product: ${productContext}`,
      },
    ],
    model: "openai/gpt-oss-20b",
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content || "No description generated.";
}
