import { isUndefined, primitive, isArray } from "./utils";
import { VNode } from "./vNode";
import { createElement } from "./patch";
import { each } from "../Object";
import { patchChildren } from "./patchChildren";

export const patchVnode = (oldVnode: VNode, newVnode: VNode): void => {
    if (oldVnode === newVnode) return

    let elm: HTMLElement = oldVnode.elm as HTMLElement

    // 新节点是个数组
    if (newVnode.children?.length && isArray<VNode>(newVnode.children)) {
        if (primitive(oldVnode.text) || !oldVnode.children?.length) {
            // 清空
            elm.innerHTML = ''
            each(newVnode.children, children => {
                elm.appendChild(createElement(children))
            })
        } else if (isArray<VNode>(oldVnode.children)) {
            // 新旧节点都有 children
            patchChildren(oldVnode.children, newVnode.children, elm)
        }
    } else if (primitive(newVnode.text)) {
        // 新节点是个 text
        if (oldVnode.text !== newVnode.text) {
            elm.innerText = newVnode.text.toString()
        }
    } else {
        // 空标签
        elm.innerHTML = ''
        elm.appendChild(createElement(newVnode))
    }

    newVnode.elm = elm
}