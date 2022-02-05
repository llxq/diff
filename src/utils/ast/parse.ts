export enum ElementType {
    HTML = 3,
    TEXT = 4
}

export interface ASTElement {
    tag?: string
    text: string
    type: ElementType // 暂时只解析 3 类型
    attribuete?: Array<{ name: string, value: string }>
    children?: Array<ASTElement>
}

// 匹配开始标签正则
const startTagReg = /^\<([a-zA-Z]+[1-6]?)\>/
// 匹配结束标签正则
const endTagReg = /^\<\/([a-zA-Z]+[1-6]?)\>/
// 匹配文字
const textTagReg = /([\s\S]*?)\</

export const parseAst = (html: string): UndefinAble<ASTElement> => {
    if (!html) return undefined
    html = html.trim()
    // 开始解析
    let astElement: UndefinAble<ASTElement>
    const stacks: Array<ASTElement> = []
    let index = 0
    let residueHtml = html
    while (index < html.length - 1) {
        residueHtml = html.substring(index)
        if (startTagReg.test(residueHtml)) {
            const startTag = residueHtml.match(startTagReg)?.[1] ?? ''
            // 入栈
            stacks.push({ tag: startTag, text: '', type: ElementType.HTML })
            index += startTag.length + 2
        } else if (textTagReg.test(residueHtml) && !endTagReg.test(residueHtml)) {
            const text = residueHtml.match(textTagReg)?.[1] ?? ''
            const prepStack = stacks[stacks.length - 1]
            if (prepStack.children?.length) {
                // 这是一个卡在标签上下的文本节点
                prepStack.children.push({ text, type: ElementType.TEXT })
            } else {
                // 单纯的文本
                prepStack.text = text
            }
            index += text.length
        } else if (endTagReg.test(residueHtml)) {
            const endTag = residueHtml.match(endTagReg)?.[1] ?? ''
            if (stacks.length > 1) {
                // 出栈
                const prepTag = stacks.pop()
                if (!prepTag) {
                    throw new Error(`缺少闭合标签 ${endTag}`)
                }
                const prepStack = stacks[stacks.length - 1]
                if (!Reflect.has(prepStack, 'children')) {
                    Reflect.set(prepStack, 'children', [])
                }
                prepStack.children!.push(prepTag)
            }
            index += endTag.length + 3
        } else {
            throw new Error(`不知道哪里缺少闭合标签`)
        }
    }
    if (stacks.length) {
        astElement = stacks.pop()!
    }
    return astElement
}

const getHtml = (ast: ASTElement): string => {
    if (ast.type === ElementType.TEXT) {
        return ast.text
    }
    const children = `${ ast.text }${ ast.children?.map(it => getHtml(it)).join('') ?? '' }`
    return `<${ast.tag}>${ children }</${ast.tag}>`
}

export const parseHtml = (ast: UndefinAble<ASTElement>): string => {
    if (ast) {
        return getHtml(ast)
    } else {
        return ''
    }
}
