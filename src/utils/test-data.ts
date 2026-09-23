import { envConfig } from '../../config/env';
import type { CheckoutInfo } from '../pages/CheckoutPage';

/**
 * Centralized, typed test data. Keeping data out of the specs themselves
 * makes it trivial to reuse across tests and to swap in a faker-generated
 * or API-seeded dataset later without touching test logic.
 */
export const users = {
  standard: {
    username: envConfig.credentials.standardUser,
    password: envConfig.credentials.password,
  },
  locked: {
    username: envConfig.credentials.lockedUser,
    password: envConfig.credentials.password,
  },
  problem: {
    username: envConfig.credentials.problemUser,
    password: envConfig.credentials.password,
  },
  invalid: {
    username: 'not_a_real_user',
    password: 'wrong_password',
  },
};

export const checkoutInfo: CheckoutInfo = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  postalCode: '94107',
};

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
};
