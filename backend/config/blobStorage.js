import 'dotenv/config';
import { BlobServiceClient } from '@azure/storage-blob';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'hotel-images';

let containerClient = null;

export const initBlobStorage = async () => {
  if (!connectionString) {
    console.error('CRITICAL: AZURE_STORAGE_CONNECTION_STRING is not defined in environment variables.');
    return;
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    containerClient = blobServiceClient.getContainerClient(containerName);

    // Try to create container and make it publicly readable, fallback to private if policy restricted
    try {
      await containerClient.createIfNotExists({
        access: 'blob', // public read access for blobs
      });
      console.log(`Azure Blob Storage container '${containerName}' ready (public access).`);
    } catch (accessErr) {
      // Fallback: Create container without public access if restricted by policy
      await containerClient.createIfNotExists();
      console.log(`Azure Blob Storage container '${containerName}' ready (private fallback).`);
    }
  } catch (error) {
    console.error('Failed to initialize Azure Blob Storage container:', error.message);
  }
};

/**
 * Upload image buffer to Azure Blob Storage
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} blobName - Unique name for the blob
 * @param {string} mimeType - The mime type of the file
 * @returns {Promise<string>} The public URL of the uploaded image
 */
export const uploadImage = async (fileBuffer, blobName, mimeType) => {
  if (!containerClient) {
    throw new Error('Azure Blob Storage has not been initialized.');
  }

  try {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
      blobHTTPHeaders: { blobContentType: mimeType },
    });

    console.log(`Uploaded file '${blobName}' to Azure Blob Storage.`);
    return blockBlobClient.url;
  } catch (error) {
    console.error(`Failed to upload file '${blobName}' to Azure Blob Storage:`, error.message);
    throw error;
  }
};
