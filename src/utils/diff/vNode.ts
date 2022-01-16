export type TagKey = keyof HTMLElementTagNameMap

export interface VNode {
    children?: Array<VNode | string>
    attribute?: Obj
    elm?: Element | HTMLElement | string
    key?: string | number
    text?: string
    selector: TagKey
}


/**
 * 创建一个VNode数据
 * @param selector 选择器
 * @param attribute 数据
 * @param children 子节点
 * @param text 文本
 * @param elm dom
 * @returns 返回一个 VNode类型数据
 */
export const vNode = (
    selector: TagKey,
    attribute: UndefinAble<Obj>,
    children: UndefinAble<Array<VNode | string>>,
    text: UndefinAble<string>,
    elm: UndefinAble<Element | HTMLElement | string>
): VNode => {
    return {
        selector,
        attribute,
        children,
        text,
        elm,
        key: attribute?.key
    }
}
