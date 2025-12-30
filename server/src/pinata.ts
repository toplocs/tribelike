import { pinataApiKey, pinataApiSecret, pinataGatewayUrl } from './config';

interface SignedUrlResponse {
  url: string;
  expiresAt: string;
}

/**
 * Generate a signed URL for uploading files to Pinata
 * This allows the frontend to upload files directly to Pinata without proxying through our server
 */
export async function generateSignedUploadUrl(
  maxUploadSize: number = 10 * 1024 * 1024, // 10MB default
  expiresIn: number = 3600 // 1 hour default
): Promise<SignedUrlResponse> {
  try {
    if (!pinataApiKey || !pinataApiSecret) {
      throw new Error('PINATA_API_KEY and PINATA_API_SECRET environment variables are required');
    }

    // Create Basic Auth header from API Key and Secret
    const credentials = Buffer.from(`${pinataApiKey}:${pinataApiSecret}`).toString('base64');
    console.log('🔐 Requesting signed upload URL');

    const response = await fetch('https://api.pinata.cloud/v3/files/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        maxUploadSize,
        expiresIn,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Pinata API response:', errorData);
      throw new Error(`Pinata API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('✅ Signed URL generated successfully');
    return {
      url: data.data.url,
      expiresAt: data.data.expiresAt,
    };
  } catch (error) {
    console.error('❌ Error generating Pinata signed URL:', error);
    throw error;
  }
}

/**
 * Get the IPFS gateway URL for a CID
 */
export function getGatewayUrl(cid: string): string {
  return `${pinataGatewayUrl}/${cid}`;
}
