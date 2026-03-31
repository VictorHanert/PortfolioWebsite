export async function generateEmbedding(text: string): Promise<number[]> {
  // Call the /api/embed endpoint (works in both dev and production)
  const res = await fetch('/api/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  
  if (!res.ok) {
    const errorMsg = await res.text();
    throw new Error(`Embed API error: ${res.status} ${res.statusText}\n${errorMsg}`);
  }

  const { embedding } = await res.json();
  return embedding;
}
