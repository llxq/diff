import { isUndefined, primitive } from "./utils";
import { VNode } from "./vNode";
import { createElement } from "./patch";
import { each } from "../Object";

export const patchVnode = (oldVnode: VNode, newVnode: VNode): void => {
    if (oldVnode === newVnode) return

    let elm: HTMLElement = oldVnode.elm as HTMLElement

    if (newVnode.children?.length) {
        if (primitive(oldVnode.text) || !oldVnode.children?.length) {
            // 清空
            elm.innerHTML = ''
            each(newVnode.children, children => {
                elm.appendChild(createElement(children))
            })
        }
    } else if (primitive(newVnode.text)) {
        if (oldVnode.text !== newVnode.text) {
            elm.innerText = newVnode.text.toString()
        }
    } else {
        elm.innerHTML = ''
        elm.appendChild(createElement(newVnode))
    }

    newVnode.elm = elm
}