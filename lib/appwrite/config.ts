// Debug: Log environment variables
console.log("Environment variables:", {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
  filesCollection: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION,
  usersCollection: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET,
  secretKey: process.env.APPWRITE_SECRET_KEY ? "SET" : "NOT SET",
});

export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  filesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secretKey: process.env.APPWRITE_SECRET_KEY!,
};
