import { isHTML, isUndefined, emptyNodeAt, sameVnode } from "./utils";
import { VNode } from "./VNode";

export const patch = (_oldVnode: HTMLElement | VNode, newVnode: VNode): VNode => {
    let oldVnode: VNode
    let elm: HTMLElement
    if (isHTML(_oldVnode)) {
        oldVnode = emptyNodeAt(_oldVnode)
    } else {
        oldVnode = _oldVnode
    }

    // 判断两个 vnode 是否相同
    if (sameVnode(oldVnode, newVnode)) {
        // 相同节点对比
    } else {
        elm = oldVnode.elm! as HTMLElement
        // 不同的时候对比
        const parent = elm.parentElement
    }

    return newVnode
}