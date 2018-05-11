import TestHarness from './test-harness';
import { ReqresClient } from '../src/client';


const runTest = (th: TestHarness, testRunner: (client: ReqresClient) => void) => {
  if (th.client) {
    testRunner(th.client);
  } else {
    expect(false).toBeTruthy();
  }
}

describe('Reqres Client', () => {
  const th = new TestHarness();

  beforeAll(async () => th.setup());
  afterAll(async () => th.teardown());

  it('should register successfully', async () => {
    runTest(th, async (client) => {
      const access = await client.register({ email: 'user@domain.com', password: 'p4ssw0rd' });
      expect(access.token).toBeTruthy();
    });
  });
});
