import { ActionTree } from 'vuex';
import * as mutate from '../shared-mutations';
import { State as RootState } from '../state';
import { GrammarProcessorState as State } from './state';

import { Collector } from '@/utils/collector';
import { Lexer } from '@/utils/lexer';
import { Parser } from '@/utils/parser';

const actions: ActionTree<State, RootState> = {
  process: ({ commit, state }, input) => {
    commit(mutate.SET_INPUT, input);
    console.log('input:', state.input);

    const lex = new Lexer(state.input);
    const tokens = lex.getTokens();
    commit(mutate.SET_TOKENS, tokens);
    console.log('tokens:', state.tokens);

    const par = new Parser(state.tokens);
    const ast = par.getAST();
    commit(mutate.SET_AST, ast);
    console.log('AST:', state.ast);
    if (state.ast !== null) {
      const output = state.ast.value;
      commit(mutate.SET_OUTPUT, output);
    }
    const collector = new Collector();
    const error = collector.getError(ast);
    commit(mutate.SET_ERROR, error);
    console.error(error);
  },
};

export default actions;
