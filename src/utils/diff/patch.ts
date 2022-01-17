import { each } from "../Object";
import { isHTML, isUndefined, emptyNodeAt, sameVnode, isVnode, primitive } from "./utils";
import { VNode } from "./vNode";
import { patchVnode } from "./patchNode";

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
    const attributeKeys: string[] = Object.keys(attribute)
    if (node.attribute) {
        each(attributeKeys, (key: string) => {
            if (key === 'class') {
                // 获取所有的class
                const classNames = attribute[key]
                if (typeof classNames === 'object') {
                    // 获取所有为 true 的值
                    each(Object.keys(classNames), className => {
                        if (classNames[className]) {
                            elm.classList.add(className)
                        }
                    })

                } else {
                    each(classNames.trim().split(' '), (calssName: string) => {
                        elm.classList.add(calssName.trim())
                    })
                }
            } else {
                elm.setAttribute(key, Reflect.get(attribute, key))
            }
        })
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

export const patch = (_oldVnode: HTMLElement | VNode, newVnode: VNode): VNode => {
    if (!_oldVnode || !newVnode) throw new Error('params is error')
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
        patchVnode(oldVnode, newVnode)
    } else {
        // 如果不是同一个节点则直接暴力替换
        elm = oldVnode.elm! as HTMLElement
        const parent = elm.parentNode

        // 创建元素
        createElement(newVnode)

        // 挂载
        if (parent && isHTML(newVnode.elm)) {
            parent.insertBefore(newVnode.elm, elm)
        }

        // 删除旧的元素
        parent?.removeChild(oldVnode.elm as Node)
    }

    return newVnode
}