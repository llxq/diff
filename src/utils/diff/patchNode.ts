import { isArray, primitive } from './utils'
import { VNode } from './vNode'
import { createElement } from './patch'
import { each } from '../Object'
import { patchChildren } from './patchChildren'

export const patchVNode = (oldVNode: VNode, newVNode: VNode): void => {
    if (oldVNode === newVNode) return

    let elm: HTMLElement = oldVNode.elm as HTMLElement

    // 新节点是个数组
    if (newVNode.children?.length && isArray<VNode>(newVNode.children)) {
        if (primitive(oldVNode.text) || !oldVNode.children?.length) {
            // 清空
            elm.innerHTML = ''
            each(newVNode.children, children => {
                elm.appendChild(createElement(children))
            })
        } else if (isArray<VNode>(oldVNode.children)) {
            // 新旧节点都有 children
            patchChildren(oldVNode.children, newVNode.children, elm)
        }
    } else if (primitive(newVNode.text)) {
        // 新节点是个 text
        if (oldVNode.text !== newVNode.text) {
            elm.innerText = newVNode.text.toString()
        }
    } else {
        // 空标签
        elm.innerHTML = ''
        elm.appendChild(createElement(newVNode))
    }

    newVNode.elm = elm
}
