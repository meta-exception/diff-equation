
import { ICircleNode, INode, INodeError, IRectangleNode, IToken } from '@/utils/model';

// tslint:disable-next-line: interface-name
export interface GrammarProcessorState {
  input: string;
  tokens: IToken[];
  ast: INode | null;
  output: string | null;
  renderQueue: Array<ICircleNode | IRectangleNode>;
  error: INodeError | null;
}
