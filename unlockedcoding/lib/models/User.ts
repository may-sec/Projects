import { getDb } from '../mongodb';

export interface User {
  _id?: string;
  email: string;
  name: string;
  picture?: string;
  googleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function createOrUpdateUser(userData: {
  email: string;
  name: string;
  picture?: string;
  googleId: string;
}): Promise<User> {
  const db = await getDb();
  const usersCollection = db.collection<User>('users');

  const now = new Date();
  const user: User = {
    email: userData.email,
    name: userData.name,
    picture: userData.picture,
    googleId: userData.googleId,
    createdAt: now,
    updatedAt: now,
  };

  // Upsert user by email or googleId
  const result = await usersCollection.findOneAndUpdate(
    {
      $or: [
        { email: userData.email },
        { googleId: userData.googleId },
      ],
    },
    {
      $set: {
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        googleId: userData.googleId,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
    }
  );

  // findOneAndUpdate returns the document directly when returnDocument is 'after'
  if (result) {
    return result as User;
  }

  // Fallback: If result is null, try to find or create the user
  const foundUser = await usersCollection.findOne({
    $or: [
      { email: userData.email },
      { googleId: userData.googleId },
    ],
  });

  if (foundUser) {
    return foundUser as User;
  }

  // If still not found, create a new one
  const insertResult = await usersCollection.insertOne(user);
  return { ...user, _id: insertResult.insertedId.toString() } as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  const usersCollection = db.collection<User>('users');
  return await usersCollection.findOne({ email });
}

export async function getUserByGoogleId(googleId: string): Promise<User | null> {
  const db = await getDb();
  const usersCollection = db.collection<User>('users');
  return await usersCollection.findOne({ googleId });
}

