// worker/index.ts - FINAL VERSION WITH CORS FIX

interface Env {
  AI: Ai;
}

// <<< DEFINE CORS HEADERS ONCE FOR REUSE >>>
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // <<< ADD THIS BLOCK TO HANDLE PREFLIGHT REQUESTS >>>
    // The browser sends an OPTIONS request first to ask for permission.
    // This block catches that request and responds with the correct headers.
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204, // No Content
        headers: corsHeaders,
      });
    }

    if (request.method === 'POST' && url.pathname === '/api/analyze-image') {
      try {
        const formData = await request.formData();
        const imageFile = formData.get('image');
        const inputPrompt = formData.get('text');

        if (!imageFile || !(imageFile instanceof File)) {
          return new Response('No image file was uploaded.', { status: 400 });
        }
        if (!inputPrompt) {
          return new Response('No text prompt was provided.', { status: 400 });
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const imageBytes = new Uint8Array(arrayBuffer);

        const inputs = {
          image: [...imageBytes],
          prompt: inputPrompt.toString(),
          max_tokens: 1024,
        };

        const response = await env.AI.run(
          "@cf/meta/llama-3.2-11b-vision-instruct",
          inputs
        );

        // <<< ADD CORS HEADERS TO THE SUCCESSFUL RESPONSE >>>
        // The actual response to the POST request also needs the permission header.
        return Response.json(response, {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders, // Add the CORS headers here
          }
        });
      } catch (error: unknown) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred.';
        // Also add CORS headers to error responses so the browser can read them
        return new Response(`Failed to analyze image: ${errorMessage}`, {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    return new Response('Not Found', {
      status: 404,
      headers: corsHeaders, // Good practice to add headers to all responses
    });
  },
} satisfies ExportedHandler<Env>;