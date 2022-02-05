import { each } from "lodash"

export enum ElementType {
    HTML = 3,
    TEXT = 4
}

interface Attribute {
    name: string
    value: string
}

export interface ASTElement {
    tag?: string
    text: string
    type: ElementType
    attribute?: Array<Attribute>
    children?: Array<ASTElement>
}

// 匹配开始标签正则
const startTagReg = /^\<([a-zA-Z]+[1-6]?)(\s[^\<]+)?\>/
// 匹配结束标签正则
const endTagReg = /^\<\/([a-zA-Z]+[1-6]?)\>/
// 匹配文字
const textTagReg = /([\s\S]*?)\</
// 属性正则
const attributeReg = /([\w-]+\s*=["']{1}[\s\w-]+["']{1})/
// 切割属性正则
const splitAttributeReg = /([\w-]+\s*)=["']{1}([\s\w-]+)["']{1}/

const getAttribute = (attributeStr: string): Array<Attribute> => {
    const attributes: Array<Attribute> = []
    if (attributeStr) {
        attributeStr = attributeStr.trim()
        let index = 0
        let residueStr = ''
        while (index < attributeStr.length - 1) {
            residueStr = attributeStr.substring(index)
            if (attributeReg.test(residueStr)) {
                const attribute = residueStr.match(attributeReg)?.[1]
                if (attribute) {
                    const splitAttribute = attribute.match(splitAttributeReg)
                    if (splitAttribute?.length && splitAttribute.length >= 3) {
                        attributes.push({ name: splitAttribute[1], value: splitAttribute[2] })
                    }
                }
                index += attribute?.length ?? 0
            } else {
                index++
            }
        }
    }
    return attributes
}

export const parseAst = (html: string): UndefinAble<ASTElement> => {
    if (!html) return undefined
    // 暂时不处理模板的前后空格
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
            const attributeStr = residueHtml.match(startTagReg)?.[2] ?? ''
            const stack = { tag: startTag, text: '', type: ElementType.HTML }
            if (attributeStr) {
                Reflect.set(stack, 'attribute', getAttribute(attributeStr))
            }
            // 入栈
            stacks.push(stack)
            index += startTag.length + 2 + attributeStr.length
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
    const children = `${ast.text}${ast.children?.map(it => getHtml(it)).join('') ?? ''}`
    let startTag = ast.tag
    if (ast.attribute) {
        each(ast.attribute, attr => {
            startTag += ` ${attr.name}="${attr.value}"`
        })
    }
    return `<${startTag}>${children}</${ast.tag}>`
}

export const parseHtml = (ast: UndefinAble<ASTElement>): string => {
    if (ast) {
        return getHtml(ast)
    } else {
        return ''
    }
}
