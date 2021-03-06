import { TagKey, vNode, VNode } from './vNode'
import { isArray, isUndefined, isVNode, primitive } from './utils'

type ChildrenType = Array<VNode> | string | number | Obj

export default function h (selector: TagKey): VNode;
export default function h (selector: TagKey, children: ChildrenType): VNode;
export default function h (selector: TagKey, attribute: UndefinAble<Obj>, children: ChildrenType): VNode;


export default function h (selector: TagKey, a?: any, b?: any): VNode {

    // 目前不处理 选择器为 div.a 和 div#b 这种情况
    if (!selector) {
        throw new Error('selector is required')
    }

    let text: UndefinAble<string>
    let attribute: UndefinAble<Obj>
    let children: UndefinAble<Array<VNode>>

    if (!isUndefined(b)) {

        if (!isUndefined(a)) {
            attribute = a
        }

        // 如果 b 存在
        if (isArray(b)) {
            children = b
        } else if (primitive(b)) {
            text = b.toString()
        } else if (isVNode(b)) {
            children = [b]
        }
    } else if (!isUndefined(a)) {
        if (isArray(a)) {
            children = a
        } else if (primitive(a)) {
            text = a.toString()
        } else if (isVNode(a)) {
            children = [a]
        } else {
            attribute = a
        }
    }

    return vNode(selector, attribute, children, text, undefined)
}
