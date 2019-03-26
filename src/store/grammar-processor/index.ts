import { Module } from 'vuex';
import { State as RootState } from '../state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import { GrammarProcessorState as State } from './state';

const state: State = {
  input: '',
  tokens: [],
  ast: null,
  output: null,
  error: null,
};

const namespaced: boolean = true;

const grammarProcessor: Module<State, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};

export default grammarProcessor;
