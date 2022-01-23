import { emptyNodeAt, isHTML, isUndefined, primitive, sameVNode } from './utils'
import { VNode } from './vNode'
import { patchVNode } from './patchNode'
import { setAttribute } from './attribute'

export const createElement = (node: VNode | string): Node => {
    if (primitive(node)) return document.createTextNode(node)
    let elm: HTMLElement

    if (!isUndefined(node.elm) && isHTML(node.elm)) {
        elm = node.elm!
    } else {
        elm = document.createElement(node.selector)
    }

    // 设置 attribute
    // 暂时不处理事件
    const attribute = node.attribute ?? {}
    if (node.attribute) {
        setAttribute(attribute, elm)
    }

    if (primitive(node.text)) {
        elm.innerHTML = node.text
    } else {
        if (node.children?.length) {
            node.children.forEach(m => elm.appendChild(createElement(m)))
        }
    }

    node.elm = elm

    return elm!
}

export const patch = (_oldVNode: HTMLElement | VNode, newVNode: VNode): VNode => {
    if (!_oldVNode || !newVNode) throw new Error('params is error')
    let oldVNode: VNode
    let elm: HTMLElement
    if (isHTML(_oldVNode)) {
        oldVNode = emptyNodeAt(_oldVNode)
    } else {
        oldVNode = _oldVNode
    }

    // 判断两个 vNode 是否相同
    if (sameVNode(oldVNode, newVNode)) {
        // 相同节点对比
        patchVNode(oldVNode, newVNode)
    } else {
        // 如果不是同一个节点则直接暴力替换
        elm = oldVNode.elm! as HTMLElement
        const parent = elm.parentNode

        // 创建元素
        createElement(newVNode)

        // 挂载
        if (parent && isHTML(newVNode.elm)) {
            parent.insertBefore(newVNode.elm, elm)
        }

        // 删除旧的元素
        parent?.removeChild(oldVNode.elm as Node)
    }

    return newVNode
}
