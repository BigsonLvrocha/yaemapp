import { expect } from 'chai';
import sinon from 'sinon';
import { Mutations, Actions } from '@/store/mixin/Async';

describe('Async store mixin', () => {
  it('should set to is loading', () => {
    const state = { loading: 0 };
    Mutations.SET_IS_LOADING(state);
    expect(state.loading).eq(1);
  });
  it('should set to is not loading', () => {
    const state = { loading: 1 };
    Mutations.CLEAR_IS_LOADING(state);
    expect(state.loading).eq(0);
  });
  it('should resolve promise and return result', async () => {
    const commit = sinon.fake();
    const callback = sinon.fake.resolves(200);
    const errorCallback = sinon.fake.throws(new Error());
    await Actions.sendRequest({ commit }, { callback, errorCallback });
    expect(commit.callCount).to.eq(2);
    expect(callback.callCount).to.eq(1);
    expect(errorCallback.callCount).to.eq(0);
  });
  it('should reject promise and throw error', () => {
    const error = new Error('error');
    const commit = sinon.fake();
    const callback = sinon.fake.rejects(200);
    const errorCallback = sinon.fake.throws(error);
    return Actions.sendRequest({ commit }, { callback, errorCallback })
      .then(
        () => Promise.reject(new Error('should catch')),
        () => {
          expect(commit.callCount).to.eq(3);
          expect(callback.callCount).to.eq(1);
          expect(errorCallback.callCount).to.eq(1);
        },
      );
  });
});
