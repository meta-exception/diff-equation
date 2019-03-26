
import { INode, IToken } from './model';

export class Parser {
  private tokens: IToken[];
  private tokenPtr: number;

  constructor(tokens: IToken[]) {
    this.tokens = tokens;
    this.tokenPtr = 0;
  }

  public getAST(): INode {
    return this.parseLang();
  }

  private parseLang(): INode {
    const start = this.tokens[this.tokenPtr];
    if (start.lexeme === 'Start') {
      this.tokenPtr++;
      const chain = this.parseChain();
      const calculations = this.parseCalculations();
      const stop = this.tokens[this.tokenPtr];
      if (stop.lexeme === 'Stop') {
        this.tokenPtr++;
        const eol = this.tokens[this.tokenPtr];
        if (eol.type === 'EOL') {
          return {
            node: 'Lang',
            children: [chain, calculations],
            value: ((chain as any).value as string) + '\n' + ((calculations as any).value as string),
          };
        } else {
          return {
            node: 'Lang',
            children: [chain, calculations],
            error: {
                message: 'После слова "Stop" ожидается конец ввода.',
                priority: 0,
                token: eol,
            },
          };
        }
      } else {
        return {
          node: 'Lang',
          children: [chain, calculations],
          error: {
              message: 'Язык заканчивается не словом "Stop".',
              priority: 1,
              token: stop,
          },
        };
      }
    } else {
      return {
        node: 'Lang',
        children: [],
        error: {
            message: 'Язык не начинается со слова "Start".',
            priority: 2,
            token: start,
        },
      };
    }
  }

  private parseChain(): INode {
    const nexus = this.parseNexus();
    this.tokenPtr++;
    if (this.tokens[this.tokenPtr + 1].type === ':') {
      const chain = this.parseChain();
      return {
        node: 'Chain',
        children: [nexus, chain],
        value: ((nexus as any).value as string) + '\n' + ((chain as any).value as string),
      };
    } else {
      return {
        node: 'Chain',
        children: [nexus],
        value: nexus.value,
      };
    }
  }

  private parseNexus(): INode {
    const id = this.tokens[this.tokenPtr];
    if (id.type === 'Integer') {
      this.tokenPtr++;
      const colon = this.tokens[this.tokenPtr];
      if (colon.type === ':') {
        this.tokenPtr++;
        const figure = this.parseFigure();
        this.tokenPtr++;
        const comma = this.tokens[this.tokenPtr];
        if (comma.type === ',') {
          this.tokenPtr++;
          const color = this.tokens[this.tokenPtr];
          if (color.type === 'Color') {
            return {
              node: 'Nexus',
              children: [figure],
              value: id.lexeme + figure.value + color.lexeme,
            };
          } else {
            return {
              node: 'Nexus',
              children: [figure],
              error: {
                  message: 'Цвет может принимать значения: "red", "green", "blue".',
                  priority: 53,
                  token: color,
              },
            };
          }
        } else {
          return {
            node: 'Nexus',
            children: [figure],
            error: {
                message: 'Пропущенна запятая после Фигуры.',
                priority: 55,
                token: comma,
            },
          };
        }
      } else {
        return {
          node: 'Nexus',
          children: [],
          error: {
              message: 'После id ожидается ":".',
              priority: 58,
              token: colon,
          },
        };
      }
    } else {
      return {
        node: 'Nexus',
        children: [],
        error: {
            message: 'Id не целое.',
            priority: 59,
            token: id,
        },
      };
    }
  }

  private parseFigure(): INode {
    const label = this.tokens[this.tokenPtr];
    if (label.type === 'Label') {
      this.tokenPtr++;
      const comma = this.tokens[this.tokenPtr];
      if (comma.type === ',') {
        this.tokenPtr++;
        switch (label.lexeme) {
        case 'circle': {
          return this.parseCircle(label);
          break;
          }
        case 'rectangle': {
          return this.parseRectangle(label);
          break;
          }
        case 'triangle': {
          return this.parseTriangle(label);
          break;
          }
        case 'trapezium': {
          return this.parseTrapezium(label);
          break;
        }
        case 'paral': {
          return this.parseParallelogram(label);
          break;
        }
        default: {
          return {
            node: 'Figure',
            children: [],
            error: {
                message: 'Неизвестный ',
                priority: 49,
                token: label,
            },
          };
          break;
        }
        }
      } else {
        return {
          node: 'Figure',
          children: [],
          error: {
              message: 'После фигуры ожидается ",".',
              priority: 48,
              token: comma,
          },
        };
      }
    } else {
      return {
        node: 'Figure',
        children: [],
        error: {
            message: 'Фигура должна начинаеться с "circle", "rectangle", "triangle", "trapezium", "paral".',
            priority: 89,
            token: label,
        },
      };
    }
  }

  private parseCircle(label: IToken): INode {
    const radius = this.tokens[this.tokenPtr];
    if (radius.type === 'Real') {
      return {
        node: 'Circle',
        children: [],
        value: 'R:' + radius.lexeme,
      };
    } else {
      return {
        node: 'Circle',
        children: [],
        error: {
            message: 'Радиус должен быть задан вещественным числом.',
            priority: 70,
            token: radius,
        },
      };
    }
  }

  private parseRectangle(label: IToken): INode {
    const xAxis = this.tokens[this.tokenPtr];
    if (xAxis.type === 'Real') {
      this.tokenPtr++;
      const comma = this.tokens[this.tokenPtr];
      if (comma.type === ',') {
        this.tokenPtr++;
        const yAxis = this.tokens[this.tokenPtr];
        if (yAxis.type === 'Real') {
          return {
            node: 'Rectangle',
            children: [],
            value: 'X:' + xAxis.lexeme + '\n' + 'Y:' + yAxis.lexeme,
          };
        } else {
          return {
            node: 'Rectangle',
            children: [],
            error: {
                message: 'Сторона должна быть задана вещественным числом.',
                priority: 66,
                token: yAxis,
            },
          };
        }
      } else {
        return {
          node: 'Rectangle',
          children: [],
          error: {
              message: 'После стороны ожидается ",".',
              priority: 65,
              token: comma,
          },
        };
      }
    } else {
      return {
        node: 'Rectangle',
        children: [],
        error: {
            message: 'Сторона должна быть задана вещественным числом.',
            priority: 64,
            token: xAxis,
        },
      };
    }
  }

  private parseTriangle(label: IToken): INode {
    const xAxis = this.tokens[this.tokenPtr];
    if (xAxis.type === 'Real') {
      this.tokenPtr++;
      const comma = this.tokens[this.tokenPtr];
      if (comma.type === ',') {
        this.tokenPtr++;
        const yAxis = this.tokens[this.tokenPtr];
        if (yAxis.type === 'Real') {
          this.tokenPtr++;
          if (comma.type === ',') {
            this.tokenPtr++;
            const angle = this.tokens[this.tokenPtr];
            if (angle.type === 'Real') {
              return {
                node: 'Triangle',
                children: [],
                value: label.lexeme + xAxis.lexeme + yAxis.lexeme + angle.lexeme,
              };
            } else {
              return {
                node: 'Triangle',
                children: [],
                error: {
                    message: 'Угол должн быть задан вещественным числом.',
                    priority: 55,
                    token: yAxis,
                },
              };
            }
          } else {
            return {
              node: 'Triangle',
              children: [],
              error: {
                  message: 'После стороны ожидается ",".',
                  priority: 54,
                  token: comma,
              },
            };
          }
        } else {
          return {
            node: 'Triangle',
            children: [],
            error: {
                message: 'Сторона должна быть задана вещественным числом.',
                priority: 53,
                token: yAxis,
            },
          };
        }
      } else {
        return {
          node: 'Triangle',
          children: [],
          error: {
              message: 'После стороны ожидается ",".',
              priority: 52,
              token: comma,
          },
        };
      }
    } else {
      return {
        node: 'Triangle',
        children: [],
        error: {
            message: 'Сторона должна быть задана вещественным числом.',
            priority: 51,
            token: xAxis,
        },
      };
    }
  }

  private parseTrapezium(label: IToken): INode {
    const xAxis = this.tokens[this.tokenPtr];
    if (xAxis.type === 'Real') {
      this.tokenPtr++;
      const comma = this.tokens[this.tokenPtr];
      if (comma.type === ',') {
        this.tokenPtr++;
        const yAxis = this.tokens[this.tokenPtr];
        if (yAxis.type === 'Real') {
          this.tokenPtr++;
          const comma = this.tokens[this.tokenPtr];
          if (comma.type === ',') {
            this.tokenPtr++;
            const zAxis = this.tokens[this.tokenPtr];
            if (zAxis.type === 'Real') {
              this.tokenPtr++;
              const comma = this.tokens[this.tokenPtr];
              if (comma.type === ',') {
                this.tokenPtr++;
                const angle = this.tokens[this.tokenPtr];
                if (angle.type === 'Real') {
                  return {
                    node: 'Trapezium',
                    children: [],
                    value: label.lexeme + xAxis.lexeme + yAxis.lexeme + zAxis.lexeme + angle.lexeme,
                  };
                } else {
                  return {
                    node: 'Trapezium',
                    children: [],
                    error: {
                        message: 'Угол должн быть задан вещественным числом.',
                        priority: 49,
                        token: yAxis,
                    },
                  };
                }
              } else {
                return {
                  node: 'Trapezium',
                  children: [],
                  error: {
                      message: 'После стороны ожидается ",".',
                      priority: 48,
                      token: comma,
                  },
                };
              }
            } else {
              return {
                node: 'Trapezium',
                children: [],
                error: {
                    message: 'Сторона должна быть задана вещественным числом.',
                    priority: 47,
                    token: zAxis,
                },
              };
            }
          } else {
            return {
              node: 'Trapezium',
              children: [],
              error: {
                  message: 'После стороны ожидается ",".',
                  priority: 46,
                  token: comma,
              },
            };
          }
        } else {
          return {
            node: 'Trapezium',
            children: [],
            error: {
                message: 'Сторона должна быть задана вещественным числом',
                priority: 45,
                token: comma,
            },
          };
        }
      } else {
        return {
          node: 'Trapezium',
          children: [],
          error: {
              message: 'После стороны ожидается ",".',
              priority: 44,
              token: comma,
          },
        };
      }
    } else {
      return {
        node: 'Trapezium',
        children: [],
        error: {
            message: 'Сторона должна быть задана вещественным числом.',
            priority: 43,
            token: xAxis,
        },
      };
    }
  }

  private parseParallelogram(label: IToken): INode {
    const xAxis = this.tokens[this.tokenPtr];
    if (xAxis.type === 'Real') {
      this.tokenPtr++;
      const comma = this.tokens[this.tokenPtr];
      if (comma.type === ',') {
        this.tokenPtr++;
        const yAxis = this.tokens[this.tokenPtr];
        if (yAxis.type === 'Real') {
          this.tokenPtr++;
          const comma = this.tokens[this.tokenPtr];
          if (comma.type === ',') {
            this.tokenPtr++;
            const height = this.tokens[this.tokenPtr];
            if (height.type === 'Real') {
              this.tokenPtr++;
              const comma = this.tokens[this.tokenPtr];
              if (comma.type === ',') {
                this.tokenPtr++;
                const angle = this.tokens[this.tokenPtr];
                if (angle.type === 'Real') {
                  return {
                    node: 'Paral',
                    children: [],
                    value: label.lexeme + xAxis.lexeme + yAxis.lexeme + height.lexeme + angle.lexeme,
                  };
                } else {
                  return {
                    node: 'Paral',
                    children: [],
                    error: {
                        message: 'Угол должн быть задан вещественным числом.',
                        priority: 38,
                        token: yAxis,
                    },
                  };
                }
              } else {
                return {
                  node: 'Paral',
                  children: [],
                  error: {
                      message: 'После высоты ожидается ",".',
                      priority: 37,
                      token: comma,
                  },
                };
              }
            } else {
              return {
                node: 'Paral',
                children: [],
                error: {
                    message: 'Высота должна быть задана вещественным числом.',
                    priority: 36,
                    token: height,
                },
              };
            }
          } else {
            return {
              node: 'Paral',
              children: [],
              error: {
                  message: 'После стороны ожидается ",".',
                  priority: 35,
                  token: comma,
              },
            };
          }
        } else {
          return {
            node: 'Paral',
            children: [],
            error: {
                message: 'Сторона должна быть задана вещественным числом',
                priority: 34,
                token: comma,
            },
          };
        }
      } else {
        return {
          node: 'Trapezium',
          children: [],
          error: {
              message: 'После стороны ожидается ",".',
              priority: 33,
              token: comma,
          },
        };
      }
    } else {
      return {
        node: 'Trapezium',
        children: [],
        error: {
            message: 'Сторона должна быть задана вещественным числом.',
            priority: 32,
            token: xAxis,
        },
      };
    }
  }

  private parseCalculations(): INode {
    const operator = this.parseOperator();
    const comma = this.tokens[this.tokenPtr];
    if (comma.type === ',') {
      this.tokenPtr++;
      if (this.tokens[this.tokenPtr].type === 'Integer' && this.tokens[this.tokenPtr + 1].type === ';') {
        const calculations = this.parseCalculations();
        return {
          node: 'Calculations',
          children: [operator, calculations],
          value: operator.value + '\n' + calculations.value,
        };
      } else if (this.tokens[this.tokenPtr].type !== 'Integer') {
        return {
          node: 'Calculations',
          children: [operator],
          error: {
            message: 'Вычисления должны начинаться с целого.',
            priority: 77,
            token: this.tokens[this.tokenPtr],
          },
        };
      } else {
        return {
          node: 'Calculations',
          children: [operator],
          value: operator.value,
        };
      }
    } else {
      return {
        node: 'Calculations',
        children: [operator],
        value: operator.value,
      };
    }
  }

  private parseOperator(): INode {
    const id = this.tokens[this.tokenPtr];
    if (id.type === 'Integer') {
      this.tokenPtr++;
      const semicolon = this.tokens[this.tokenPtr];
      if (semicolon.type === ';') {
        this.tokenPtr++;
        const label = this.tokens[this.tokenPtr];
        if (label.type === 'Label') {
          this.tokenPtr++;
          const colon = this.tokens[this.tokenPtr];
          if (colon.type === ':') {
            this.tokenPtr++;
            const formula = this.parseFormula();
            return {
              node: 'Operator',
              children: [formula],
              value: id.lexeme + ';' + label.lexeme + ':' + formula.value,
            };
          } else {
            return {
              node: 'Operator',
              children: [],
              error: {
                  message: 'После метки ожидается ":".',
                  priority: 29,
                  token: semicolon,
              },
            };
          }
        } else {
          return {
            node: 'Operator',
            children: [],
            error: {
                message: 'Метка может принимать значения: "circle", "rectangle", "triangle", "trapezium", "paral".',
                priority: 28,
                token: label,
            },
          };
        }
      } else {
        return {
          node: 'Operator',
          children: [],
          error: {
              message: 'После id ожидается ";".',
              priority: 27,
              token: semicolon,
          },
        };
      }
    } else {
      return {
        node: 'Operator',
        children: [],
        error: {
            message: 'Id не целое.',
            priority: 26,
            token: id,
        },
      };
    }
  }

  private parseFormula(): INode {
    const left = this.tokens[this.tokenPtr];
    if (left.type === 'Square') {
      this.tokenPtr++;
      const eq = this.tokens[this.tokenPtr];
      if (eq.type === '=') {
        this.tokenPtr++;
        const right = this.parseRight();
        return {
          node: 'Formula',
          children: [right],
          value: left.lexeme + '=' + right.value,
        };
      } else {
        return {
          node: 'Formula',
          children: [],
          error: {
              message: 'Ожидается "=".',
              priority: 25,
              token: left,
          },
        };
      }
    } else if (left.type === 'Perimeter') {
      this.tokenPtr++;
      const eq = this.tokens[this.tokenPtr];
      if (eq.type === '=') {
        this.tokenPtr++;
        const right = this.parseRight();
        return {
          node: 'Formula',
          children: [right],
          value: left.lexeme + '=' + right.value,
        };
      } else {
        return {
          node: 'Formula',
          children: [],
          error: {
              message: 'Ожидается "=".',
              priority: 24,
              token: eq,
          },
        };
      }
    } else {
      return {
        node: 'Formula',
        children: [],
        error: {
            message: 'Ожидается "s" или "p".',
            priority: 23,
            token: left,
        },
      };
    }
  }

  private parseRight(): INode {
    return this.parseAS();
  }

  private parseF(): INode {
    const LP = this.tokens[this.tokenPtr];
    if (LP.type === '(') {
      this.tokenPtr++;
      const ev = this.parseAS();
      const RP = this.tokens[this.tokenPtr];
      if (RP.type === ')') {
        this.tokenPtr++;
        return {
          node: 'F',
          children: [ev],
          value: ev.value,
        };
      } else {
        return {
          node: 'F',
          children: [ev],
          error: {
              message: 'Ожидается закрытая скобка ")".',
              priority: 22,
              token: RP,
          },
        };
      }
    } else {
      return this.parseU();
    }
  }

  private parseP(): INode {
    const LP = this.tokens[this.tokenPtr];
    if (LP.type === '(') {
      this.tokenPtr++;
      const ev = this.parseAS();
      const RP = this.tokens[this.tokenPtr];
      if (RP.type === ')') {
        this.tokenPtr++;
        return {
          node: 'P',
          children: [ev],
          value: ev.value,
        };
      } else {
        return {
          node: 'P',
          children: [ev],
          error: {
              message: 'Ожидается закрытая скобка ")".',
              priority: 21,
              token: RP,
          },
        };
      }
    } else if (LP.type === '-') {
      this.tokenPtr++;
      const LP = this.tokens[this.tokenPtr];
      if (LP.type === '(') {
        this.tokenPtr++;
        const ev = this.parseAS();
        const RP = this.tokens[this.tokenPtr];
        if (RP.type === ')') {
          this.tokenPtr++;
          return {
            node: 'P',
            children: [ev],
            value: ev.value,
          };
        } else {
          return {
            node: 'P',
            children: [ev],
            error: {
                message: 'Ожидается закрытая скобка ")".',
                priority: 20,
                token: RP,
            },
          };
        }
      } else {
        const u = this.parseU();
        return {
          node: 'P',
          children: [u],
          value: -(u as any).value,
        };
      }
    } else {
      return this.parseU();
    }
  }

  private parseE(): INode {
    const p = this.parseP();
    const exp = this.tokens[this.tokenPtr];
    if (exp.type === '^') {
      this.tokenPtr++;
      const e = this.parseE();
      return {
        node: 'Exp',
        children: [p, e],
        value: Math.pow((p as any).value, (e as any).value),
      };
    } else {
      return p;
    }
  }

  private parseMD(): INode {
    const e = this.parseE();
    const md = this.parseMDl();
    if (md === undefined) {
      return e;
    } else {
      if (md.node === '*') {
        return {
          node: '*',
          children: [e, md],
          value: (e as any).value * (md as any).value,
        };
      } else {
        return {
          node: '/',
          children: [e, md],
          value: (e as any).value / (md as any).value,
        };
      }
    }
  }

  private parseMDl(): INode | undefined {
    const op = this.tokens[this.tokenPtr];
    if (op.type === '/' || op.type === '*') {
      this.tokenPtr++;
      const e = this.parseE();
      const md = this.parseMDl();
      if (md === undefined) {
        if (op.type === '*') {
          return {
            node: '*',
            children: [e],
            value: e.value,
          };
        } else {
          return {
            node: '/',
            children: [e],
            value: e.value,
          };
        }
      } else {
        if (md.node === '*') {
          return {
            node: op.type,
            children: [e, md],
            value: (e as any).value * (md as any).value,
          };
        } else {
          return {
            node: op.type,
            children: [e, md],
            value: (e as any).value / (md as any).value,
          };
        }
      }
    } else {
      return;
    }
  }

  private parseAS(): INode {
    const md = this.parseMD();
    const as = this.parseASl();
    if (as === undefined) {
      return md;
    } else {
      if (as.node === '+') {
        return {
          node: '+',
          children: [as, md],
          value: parseFloat((as as any).value) + parseFloat((md as any).value),
        };
      } else {
        return {
          node: '-',
          children: [as, md],
          value: parseFloat((as as any).value) - parseFloat((md as any).value),
        };
      }
    }
  }

  private parseASl(): INode | undefined {
    const op = this.tokens[this.tokenPtr];
    if (op.type === '-' || op.type === '+') {
      this.tokenPtr++;
      const md = this.parseMD();
      const as = this.parseASl();
      if (as === undefined) {
        if (op.type === '+') {
          return {
            node: '+',
            children: [md],
            value: md.value,
          };
        } else {
          return {
            node: '-',
            children: [md],
            value: md.value,
          };
        }
      } else {
        if (as.node === '+') {
          return {
            node: op.type,
            children: [md, as],
            value: parseFloat((as as any).value) + parseFloat((md as any).value),
          };
        } else {
          return {
            node: op.type,
            children: [md, as],
            value: parseFloat((as as any).value) - parseFloat((md as any).value),
          };
        }
      }
    } else {
      return;
    }
  }

  private parseU(): INode {
    const m = this.tokens[this.tokenPtr];
    if (m.type === '-') {
      this.tokenPtr++;
      const n = this.parseN();
      return {
        node: 'Unary',
        children: [n],
        value: -(n as any).value,
      };
    } else {
      return this.parseN();
    }
  }

  private parseN(): INode {
    const n = this.tokens[this.tokenPtr];
    if (n.type === 'Real') {
      this.tokenPtr++;
      return {
        node: 'N',
        children: [],
        value: parseFloat(n.lexeme),
      };
    } else if (n.type === 'Integer') {
      this.tokenPtr++;
      return {
        node: 'N',
        children: [],
        value: parseInt(n.lexeme, 10),
      };
    } else if (n.type === 'Function') {
      this.tokenPtr++;
      const f = this.parseF();
      switch (n.lexeme) {
        case 'sin': {
          return {
            node: 'N',
            children: [f],
            value: Math.sin((f as any).value),
          };
          break;
        }
        case 'cos': {
          return {
            node: 'N',
            children: [f],
            value: Math.cos((f as any).value),
          };
          break;
        }
        case 'abs': {
          return {
            node: 'N',
            children: [f],
            value: Math.abs((f as any).value),
          };
          break;
        }
        default: {
          return {
            node: 'N',
            children: [],
            error: {
                message: 'Неизвестная функция.',
                priority: 19,
                token: n,
            },
          };
          break;
        }
      }
    } else {
      return {
        node: 'N',
        children: [],
        error: {
          message: 'Ожидается функция, целое или вещественное число.',
          priority: 18,
          token: n,
        },
      };
    }
  }

}
