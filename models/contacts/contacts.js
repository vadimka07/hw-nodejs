import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const filepath = path.resolve("models", "contacts", "contacts.json");

const updateContacts = contacts => fs.writeFile(filepath, JSON.stringify(contacts, null, 2));
const listContacts = async () => {
  const data = await fs.readFile(filepath);
  return JSON.parse(data);
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find(item => item.id === contactId);
  return result || null;
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactId);
  if(index === -1){
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await updateContact(contacts);
  return result;
}

const addContact = async ({title, director}) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    title,
    director,
  }
  contacts.push(newContact);
  await updateContact(contacts);
  return newContact;
}

const updateContact = async(contactId, {title, director}) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactId);
  if(index === -1){
    return null;
  }
  contacts[index] = {contactId, title, director};
  await updateContacts(contacts);
  return contacts[index];
}


export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
