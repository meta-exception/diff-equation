
export interface IToken {
  type: string;
  lexeme: string;
  token: {
    start: number;
    end: number;
  };
  layout: {
    line: number;
    position: number;
  };
}

export interface INode {
  node: string;
  children: INode[];
  value?: number | string;
  error?: INodeError;
}

export interface INodeError {
  message: string;
  priority: number;
  token: IToken;
}
