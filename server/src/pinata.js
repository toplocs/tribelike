"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSignedUploadUrl = generateSignedUploadUrl;
exports.getGatewayUrl = getGatewayUrl;
const config_1 = require("./config");
/**
 * Generate a signed URL for uploading files to Pinata
 * This allows the frontend to upload files directly to Pinata without proxying through our server
 */
async function generateSignedUploadUrl(maxUploadSize = 10 * 1024 * 1024, // 10MB default
expiresIn = 3600 // 1 hour default
) {
    try {
        if (!config_1.pinataApiKey || !config_1.pinataApiSecret) {
            throw new Error('PINATA_API_KEY and PINATA_API_SECRET environment variables are required');
        }
        // Create Basic Auth header from API Key and Secret
        const credentials = Buffer.from(`${config_1.pinataApiKey}:${config_1.pinataApiSecret}`).toString('base64');
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
    }
    catch (error) {
        console.error('❌ Error generating Pinata signed URL:', error);
        throw error;
    }
}
/**
 * Get the IPFS gateway URL for a CID
 */
function getGatewayUrl(cid) {
    return `${config_1.pinataGatewayUrl}/${cid}`;
}
