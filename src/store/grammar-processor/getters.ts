import { GetterTree } from 'vuex';
import { State as RootState } from '../state';
import { GrammarProcessorState as State } from './state';

const getters: GetterTree<State, RootState> = {
  tokens: (state) => {
    return state.tokens;
  },
  output: (state) => {
    return state.output;
  },
  error: (state) => {
    return state.error;
  },
  renderQueue: (state) => {
    return state.renderQueue;
  },
};

export default getters;
