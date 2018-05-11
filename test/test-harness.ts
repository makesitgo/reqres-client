const { ReqresClientFactory } = require('../src');
import { ReqresClient } from '../src/client';

export default class TestHarness {
  public client?: ReqresClient;

  constructor(public options: object = {}) {}

  async setup() {
    this.client = await ReqresClientFactory.create(this.options);
  }

  async teardown() {
  }
}
