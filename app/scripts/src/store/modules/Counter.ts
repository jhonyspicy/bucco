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
  @Action({commit: 'incr'}) incr() {
    console.log(1);
    return 5;
  }

  // action 'decr' commits mutation 'decrement' when done with return value as payload
  @Action({commit: 'decr'}) decr() {
    return 5;
  }
}

