"use server";

import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  NEXT_PUBLIC_ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  console.log("📡 createUser called with:", user); // <--- add this
  try {
    const newUser = await users.create({
      userId: ID.unique(),
      email: user.email,
      name: user.name,
      phone: user.phone,
    });

    console.log("✅ User created:", newUser);
    return newUser;
  } catch (error: any) {
    console.log("❌ Error in createUser:", error);
    if (error?.code === 409) {
      const existingUsers = await users.list({
        queries: [Query.equal("email", [user.email])],
      });
      return existingUsers?.users?.[0];
    }
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get({ userId });
    return parseStringify(user);
  } catch (error: any) {
    console.log("❌ Error in getUser:", error);
    console.log(error);
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    return parseStringify(patients.documents[0]);
  } catch (error: any) {
    console.log("❌ Error in getPatient:", error);
    console.log(error);
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      const blobFile = identificationDocument?.get("blobFile") as Blob;
      const fileName = identificationDocument?.get("fileName") as string;

      const arrayBuffer = await blobFile.arrayBuffer();
      const inputFile = InputFile.fromBuffer(
        Buffer.from(arrayBuffer),
        fileName
      );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);

      const newPatient = await databases.createDocument(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        ID.unique(),
        {
          identificationDocumentId: file?.$id || null,
          identificationDocumentUrl: `${NEXT_PUBLIC_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
          ...patient,
        }
      );
      return parseStringify(newPatient);
    }
  } catch (error) {
    console.log(error);
  }
};
