import { each } from "../Object";
import Scanned from "./Scanned";

export interface TokenType {
    type: 'text' | 'expression' | '#' | '/' | '.'
    content: string
    index?: number
    children?: Array<TokenType>
}

export default class Tokens {

    public scanned: Scanned

    public tokens: Array<TokenType> = []

    constructor (public templateStr: string) {
        this.scanned = new Scanned(templateStr)
    }

    private addToken (token: Partial<TokenType>): void {
        this.tokens.push({
            type: token.type ?? 'text',
            content: token.content ?? '',
            index: token.index ?? -1,
            children: token.children ?? []
        })
    }

    private parseTokens = (tokens: Array<TokenType>): Array<TokenType> => {
        const parseTokens: Array<TokenType> = []

        const stacks: Array<TokenType> = []

        // 收集器
        let collection = parseTokens

        each(tokens, item => {
            switch (item.type) {
                case '#':
                    collection.push(item)
                    stacks.push(item)
                    // 修改收集器指向，指向下一层
                    collection = item.children ?? []
                    break
                case '/':
                    // 出栈
                    stacks.pop()
                    // 如果栈内有东西，则将收集器指向上一个栈的children
                    if (stacks.length > 0) {
                        collection = stacks.slice(-1).pop()?.children ?? []
                    } else {
                        // 将收集器指向结果数组
                        collection = parseTokens
                    }
                    break
                default:
                    // 收集器只需要push就行了。因为收集器会自动指向当前需要收集的children
                    collection.push(item)

            }
        })

        return parseTokens
    }

    public getTokens (): Array<TokenType> {
        while (this.scanned.hasNext) {
            const words = this.scanned.find('{{')
            words && this.addToken({content: words, index: this.scanned.index})

            const expression = this.scanned.find('}}')?.trim() ?? ''
            if (expression) {
                const firstChar = expression[0] ?? ''
                let token: TokenType = {type: 'expression', content: expression.substring(1), index: this.scanned.index}
                switch (firstChar) {
                    case '#':
                        token.type = '#'
                        break
                    case '/':
                        token.type = '/'
                        break
                    case '.':
                        token.type = '.'
                        break
                    default:
                        token.content = expression
                }
                this.addToken(token)
            }
        }

        return this.parseTokens(this.tokens)
    }

}
