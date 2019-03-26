
import { INode, INodeError, IToken } from '@/utils/model';

// tslint:disable-next-line: interface-name
export interface GrammarProcessorState {
  input: string;
  tokens: IToken[];
  ast: INode | null;
  output: string | null;
  error: INodeError | null;
}
