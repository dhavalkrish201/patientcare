import * as sdk from "node-appwrite";

export const {
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT,
} = process.env;

console.log("Check ENV", NEXT_PUBLIC_ENDPOINT, PROJECT_ID, API_KEY);

const client = new sdk.Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("68bfc1dc003d66867590")
  .setKey(
    "standard_1a88f8b2223b5154766fddfee89b4f0d7ae28f353e6662ea728dd251417f30bfb31a6968e158d19d2b04fb8a491645f849ee0a88566141e6f8eb58e49430d5186416047dc264af17a5188d4bab5aba4a7231e7dfb71a16312cf33754bb19660886a62107836683a729fbd8439e5cba7eeaab3bc42f67fb0df71b4d5f8c1b4b34"
  );

console.log("client", client);

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);
