import { NextResponse } from 'next/server';
import productsData from '@/app/data/products.json';

export async function POST(request) {
  const { messages } = await request.json();

  const systemPromptText = `You are a well-trained senior expert doctor specializing in Vestige products. Your knowledge is strictly limited to the following JSON data. Do not use any external medical knowledge.

  Product Data:
  ${JSON.stringify(productsData)}
  
  Rules:
  1. Never recommend or mention products not in the provided JSON data.
  2. As an expert doctor, you must deeply understand the user's health concern from their prompt, even if it's an incomplete sentence or uses general terms.
  3. To find the most relevant product(s), you must make a logical connection between the user's stated problem and the product's purpose, based on its 'name', 'description', and 'benefits' in the JSON. If multiple products are relevant, recommend all of them.
  4. For each recommended product, follow this EXACT format with proper spacing:
     **Product: [Product Name]**

     **Description:** [Description]

     **Benefits:**
       - [Benefit 1]
       - [Benefit 2]

     **Usage:** [Usage instructions]

     *For multiple products, add three dashes (---) on a new line with a blank line before and after.*
  5. For any non-health related questions or queries, respond ONLY with this exact message: "I'm sorry, I trained to help with health-related questions. Please describe your health concern for a suitable product suggestion."
  6. If the user's symptom is in Kannada, you must respond in Kannada, following the same detailed structure.
  7. If you cannot find a relevant product in the JSON, say: "Based on the information provided, I can only recommend products from the Vestige catalog. Please describe your health concern for a suitable product suggestion."`;

  const requestData = {
    model: 'llama3-70b-8192',
    messages: [
      { role: 'system', content: systemPromptText },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 1,
  };

  try {
    const response = await fetch(process.env.GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return NextResponse.json({ reply: data.choices[0].message.content });
    } else {
      console.error('Groq API response did not contain choices:', data);
      return NextResponse.json({ error: 'Sorry, I could not get a response. Please try again.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return NextResponse.json({ error: 'An error occurred while communicating with the AI.' }, { status: 500 });
  }
}
