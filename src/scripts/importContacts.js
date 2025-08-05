import dotenv from 'dotenv';
import { initMongoConnection } from '../db/initMongoConnection.js';
import Contact from '../db/models/Contact.js';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const importContacts = async () => {
  try {
    await initMongoConnection();

    const filePath = path.resolve('src', 'db', 'contacts.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const contacts = JSON.parse(fileData);

    await Contact.insertMany(contacts);
    console.log('Contacts imported successfully!');
  } catch (error) {
    console.error('Error importing contacts:', error.message);
  } finally {
    process.exit();
  }
};

importContacts();
