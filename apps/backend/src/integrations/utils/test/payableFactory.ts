import { faker } from '@faker-js/faker';
import { payable } from 'database';
export const payableFactory = (): payable => ({
  assignor: faker.string.uuid(),
  emissionDate: faker.date.anytime(),
  id: faker.string.uuid(),
  value: Number(faker.finance.amount()),
});
