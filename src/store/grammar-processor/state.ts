
import { IToken } from '@/utils/model';

// tslint:disable-next-line: interface-name
export interface GrammarProcessorState {
  input: string;
  tokens: IToken[];
}
