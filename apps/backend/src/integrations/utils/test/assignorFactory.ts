import { faker } from '@faker-js/faker';
import { assignor } from 'database';
export const assignorFactory = (): assignor => ({
  document: faker.string.alphanumeric(),
  email: faker.internet.email(),
  id: faker.string.uuid(),
  name: faker.person.firstName(),
  phone: faker.phone.number(),
});
