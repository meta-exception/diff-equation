
import { INode, INodeError } from './model';

export class Collector {

  private collected: INodeError[];

  constructor() {
    this.collected = [];
  }

  public getError(ast: INode): INodeError {
    this.collectErrors(ast);
    this.sortErrors();
    console.log(this.collected);
    return this.collected[0];
  }

  private collectErrors(ast: INode): void {
    if (ast.error) {
      this.collected.push(ast.error);
    }
    const { children } = ast;
    children.forEach((child) => this.collectErrors(child));
  }

  private sortErrors(): void {
    if (this.collected.length > 0) {
      this.collected.sort((errA, errB) => errB.priority - errA.priority);
    }
  }
}
