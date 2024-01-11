import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signup: () => string[];
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'test-key';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signup = () => {
  // build jwt payload
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build the session object
  const session = { jwt: token };

  // turn it into json
  const sessionJson = JSON.stringify(session);

  // convert to base64
  const base64 = Buffer.from(sessionJson).toString('base64');

  // return a string of the encoded data (cookie)
  return [`session=${base64}`];
};
