import { MutationTree } from 'vuex';
import * as mutate from '../shared-mutations';
import { GrammarProcessorState as State } from './state';

const mutations: MutationTree<State> = {
  [mutate.SET_INPUT]: (state, input) => {
    state.input = input;
  },
  [mutate.SET_TOKENS]: (state, tokens) => {
    state.tokens = tokens;
  },
  [mutate.SET_AST]: (state, ast) => {
    state.ast = ast;
  },
  [mutate.SET_OUTPUT]: (state, output) => {
    state.output = output;
  },
  [mutate.SET_ERROR]: (state, error) => {
    state.error = error;
  },
};

export default mutations;
