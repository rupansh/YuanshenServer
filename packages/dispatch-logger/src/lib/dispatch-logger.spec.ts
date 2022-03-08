import { dispatchLogger } from './dispatch-logger';

describe('dispatchLogger', () => {
  it('should work', () => {
    expect(dispatchLogger()).toEqual('dispatch-logger');
  });
});
