import TestHarness from './test-harness';
import { UsersApi } from '../src/types';

describe('Users', () => {
  let th = new TestHarness();
  let users: UsersApi;

  beforeAll(async () => th.setup());
  afterAll(async () => th.teardown());

  beforeEach(() => {
    if (th.client) {
      users = th.client.users();
    }
  });

  it('should list all users', async () => {
    expect.assertions(5);
    if (th.client) {
      const userList = await th.client.users().list();
      expect(userList.page).toEqual(1);
      expect(userList.per_page).toEqual(3);
      expect(userList.total).toEqual(12);
      expect(userList.total_pages).toEqual(4);
      expect(userList.data).toHaveLength(3);
    }
  });

  it('should get a user', async () => {
    const user = await users.user(1).get();
    expect(user.data).toBeTruthy();
  });
});
