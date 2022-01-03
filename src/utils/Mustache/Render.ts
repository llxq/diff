import { each } from "../Object";
import Tokens, { TokenType } from "./Tokens";
import { isArray, toPath, get } from 'lodash'

export default class Render {

    public readonly tokens: Array<TokenType>

    constructor(public templateStr: string, public data: Obj) {
        const token = new Tokens(this.templateStr)
        this.tokens = token.getTokens() ?? []
    }

    private get = (data: Obj, token: TokenType, toString = true): any => {
        try {
            const result = get(data, toPath(token.content ?? ''))
            return toString ? JSON.stringify(result) : result
        } catch (e) {
            console.log(e)
            return undefined
        }
    }

    private setData = (tokens: Array<TokenType>, data: any): string => {
        let renderStr: string = ''
        each(tokens, token => {
            if (token.type === 'text') {
                renderStr += token.content
            } else if (token.type === '#') {
                // 数组判断
                const list = this.get(data, token, false)
                if (isArray(list) && list.length) {
                    each(list, item => {
                        renderStr += this.setData(token.children ?? [], item)
                    })
                }
            } else if (token.type === '.') {
                try {
                    if (typeof data !== 'object') {
                        renderStr += data
                    } else {
                        renderStr += JSON.stringify(data)
                    }
                } catch (e) {
                    console.log(e)
                }
            } else if (token.type === 'expression') {
                renderStr += this.get(data, token)
            }
        })

        return renderStr
    }

    public render(): string {
        return this.setData(this.tokens, this.data)
    }
}
