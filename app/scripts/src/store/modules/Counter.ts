import {Module, VuexModule, Mutation, Action} from 'vuex-module-decorators';

@Module({namespaced: true})
export default class Counter extends VuexModule {
  count = 0;

  @Mutation INCREMENT(payload: any) {
    console.log('INCREMENT');
    this.count += payload.amount;
  }

  @Mutation DECREMENT(payload: any) {
    console.log('DECREMENT');
    this.count -= payload.amount;
  }

  // action 'incr' commits mutation 'increment' when done with return value as payload
  @Action({commit: 'increment'}) incr() {
    console.log('increment');
    return 5;
  }

  // action 'decr' commits mutation 'decrement' when done with return value as payload
  @Action({commit: 'decrement'}) decr() {
    console.log('decrement');
    return 5;
  }
}

