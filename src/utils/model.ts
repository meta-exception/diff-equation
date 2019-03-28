
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

export interface ICircleNode extends INode {
  node: 'Circle';
  radius: number;
}

export interface IRectangleNode extends INode {
  node: 'Rectangle';
  width: number;
  height: number;
}

export interface ITriangleNode extends INode {
  node: 'Triangle';
  x: number;
  y: number;
  angle: number;
}

export interface ITrapeziumNode extends INode {
  node: 'Trapezium';
  x: number;
  y: number;
  z: number;
  angle: number;
}

export interface IParallelogramNode extends INode {
  node: 'Trapezium';
  x: number;
  y: number;
  height: number;
  angle: number;
}
