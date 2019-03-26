import { isBorders, isColor, isDigit, isEOL, isFunction, isInteger, isLabel, isLetter, isNewLine, isReal, isReservedSymbol, isSP, isVariable, isWhitespace} from './helpers';

import { IToken } from './model';

export class Lexer {
  private input: string;

  private lexemePtr: number;
  private lookaheadPtr: number;

  // this.lexemePtr - this.lastNewLinePtr -> character number
  private lastNewLinePtr: number;
  // line numeration from zero
  private lineCounter: number;

  constructor(input: string) {
    this.input = input;
    this.lexemePtr = 0;
    this.lookaheadPtr = 1;
    this.lastNewLinePtr = 0;
    this.lineCounter = 0;
  }

  public getTokens(): Array<IToken | undefined> {
    const tokens = [];
    let word = this.getNextLexeme();
    tokens.push(word);
    while (word && word.type !== 'EOL') {
      word = this.getNextLexeme();
      console.log('word', word);
      tokens.push(word);
    }
    return tokens;
  }

  private getNextLexeme(): IToken | undefined {
    const currentChar = this.input.charAt(this.lexemePtr);
    if (isWhitespace(currentChar)) {
      if (isNewLine(currentChar)) {
        this.lineCounter++;
        this.lastNewLinePtr = this.lexemePtr;
      }
      this.lexemePtr++;
      return this.getNextLexeme();
    } else if (isEOL(currentChar)) {
      return this.createLexeme('EOL', '');
    } else {
      return this.getLexeme();
    }
  }

  private getLexeme(): IToken | undefined {
    // now `lexemePtr` point out to start of lexeme
    this.lookaheadPtr = this.lexemePtr + 1;

    while (this.lookaheadPtr <= this.input.length) {
      const currentLexeme = this.input.substring(this.lexemePtr, this.lookaheadPtr);
      const lookaheadChar = this.input.charAt(this.lookaheadPtr);

      if (isReservedSymbol(currentLexeme)) {
        const lexeme = this.createLexeme(currentLexeme, currentLexeme);
        this.lexemePtr = this.lookaheadPtr;
        return lexeme;
      } else if (isSP(currentLexeme)) {
        if (isWhitespace(lookaheadChar) || isEOL(lookaheadChar) || isReservedSymbol(lookaheadChar)) {
          const lexeme = (currentLexeme === 's') ?
            this.createLexeme('Square', currentLexeme) :
            this.createLexeme('Perimeter', currentLexeme);
          this.lexemePtr = this.lookaheadPtr;
          return lexeme;
        } else {
          this.lookaheadPtr++;
        }
      } else if (isBorders(currentLexeme)) {
        if (isWhitespace(lookaheadChar) || isEOL(lookaheadChar) || isReservedSymbol(lookaheadChar) || isDigit(lookaheadChar)) {
          const lexeme = this.createLexeme('Border', currentLexeme);
          this.lexemePtr = this.lookaheadPtr;
          return lexeme;
        } else {
          this.lookaheadPtr++;
        }
      } else if (isInteger(currentLexeme)) {
        if (isWhitespace(lookaheadChar) || isEOL(lookaheadChar) || isReservedSymbol(lookaheadChar) || isLetter(lookaheadChar)) {
          const lexeme = this.createLexeme('Integer', currentLexeme);
          this.lexemePtr = this.lookaheadPtr;
          return lexeme;
        } else {
          this.lookaheadPtr++;
        }
      } else if (isReal(currentLexeme)) {
        if (isWhitespace(lookaheadChar) || isEOL(lookaheadChar) || isReservedSymbol(lookaheadChar) || isLetter(lookaheadChar)) {
          const lexeme = this.createLexeme('Real', currentLexeme);
          this.lexemePtr = this.lookaheadPtr;
          return lexeme;
        } else {
          this.lookaheadPtr++;
        }
      } else if (isLabel(currentLexeme)) {
        if (isWhitespace(lookaheadChar) || isEOL(lookaheadChar) || isReservedSymbol(lookaheadChar) || isDigit(lookaheadChar)) {
          const lexeme = this.createLexeme('Label', currentLexeme);
          this.lexemePtr = this.lookaheadPtr;
          return lexeme;
        } else {
          this.lookaheadPtr++;
        }
      } else if (isColor(currentLexeme)) {
        if (isWhitespace(lookaheadChar) || isEOL(lookaheadChar) || isReservedSymbol(lookaheadChar) || isDigit(lookaheadChar)) {
          const lexeme = this.createLexeme('Color', currentLexeme);
          this.lexemePtr = this.lookaheadPtr;
          return lexeme;
        } else {
          this.lookaheadPtr++;
        }
      } else if (isFunction(currentLexeme)) {
        if (isWhitespace(lookaheadChar) || isEOL(lookaheadChar) || isReservedSymbol(lookaheadChar) || isDigit(lookaheadChar)) {
          const lexeme = this.createLexeme('Function', currentLexeme);
          this.lexemePtr = this.lookaheadPtr;
          return lexeme;
        } else {
          this.lookaheadPtr++;
        }
      } else if (isVariable(currentLexeme)) {
        if (isWhitespace(lookaheadChar) || isEOL(lookaheadChar) || isReservedSymbol(lookaheadChar)) {
          const lexeme = this.createLexeme('Variable', currentLexeme);
          this.lexemePtr = this.lookaheadPtr;
          return lexeme;
        } else {
          this.lookaheadPtr++;
        }
      } else {
        this.lookaheadPtr++;
      }
    }
  }

  private createLexeme(type: string, lexeme: string): IToken {
    return {
      type,
      lexeme,
      token: {
        start: this.lexemePtr,
        end: this.lookaheadPtr,
      },
      layout: {
        line: this.lineCounter,
        position: this.lexemePtr - this.lastNewLinePtr,
      },
    };
  }

}
