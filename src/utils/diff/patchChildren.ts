import { VNode } from './vNode'
import { isHTML, isUndefined, sameVNode } from './utils'
import { patchVNode } from './patchNode'
import { createElement } from './patch'

// 获取索引所对应的key
const getIdxMap = (startIdx: number, endIdx: number, node: VNode[]): Map<string, number> => {
    const map: Map<string, number> = new Map()
    for (let i = startIdx; i <= endIdx; i++) {
        const key = node[i].attribute?.key
        if (!isUndefined(key)) {
            map.set(key.toString(), i)
        }
    }
    return map
}

export const patchChildren = (oldChildren: VNode[], newChildren: VNode[], parent: HTMLElement): void => {
    // 新前
    let newStartIdx = 0
    let newStartNode = newChildren[0]
    // 新后
    let newEndIdx = newChildren.length - 1
    let newEndNode = newChildren[newEndIdx]
    // 旧前
    let oldStartIdx = 0
    let oldStartNode = oldChildren[0]
    // 旧后
    let oldEndIdx = oldChildren.length - 1
    let oldEndNode = oldChildren[oldEndIdx]

    // 旧的key缓存
    let oldKeyCache: UndefinAble<Map<string, number>>

    while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {
        if (isUndefined(newStartNode)) {
            newStartNode = newChildren[++newStartIdx]
        } else if (isUndefined(newEndNode)) {
            newEndNode = newChildren[--newEndIdx]
        } else if (isUndefined(oldStartNode)) {
            oldStartNode = oldChildren[++oldStartIdx]
        } else if (isUndefined(oldEndNode)) {
            oldEndNode = oldChildren[--oldEndIdx]
        } else if (sameVNode(newStartNode, oldStartNode)) { // 新前 与 旧前
            // 更新节点（会更新newStartNode的elm）
            patchVNode(oldStartNode, newStartNode)
            newStartNode = newChildren[++newStartIdx]
            oldStartNode = oldChildren[++oldStartIdx]
        } else if (sameVNode(newEndNode, oldEndNode)) { // 新后 与 旧后
            // 更新节点 （会更新newEndNode的elm）
            patchVNode(oldEndNode, newEndNode)
            newEndNode = newChildren[--newEndIdx]
            oldEndNode = oldChildren[--oldEndIdx]
        } else if (sameVNode(newEndNode, oldStartNode)) { // 新后 与 旧前
            patchVNode(oldStartNode, newEndNode)
            // 移动节点 把旧前移动到旧后后面
            if (isHTML(oldEndNode.elm) && isHTML(oldStartNode.elm)) {
                parent.insertBefore(oldStartNode.elm, oldEndNode.elm.nextSibling)
            }
            newEndNode = newChildren[--newEndIdx]
            oldStartNode = oldChildren[++oldStartIdx]
        } else if (sameVNode(newStartNode, oldEndNode)) { // 新前 与 旧后
            patchVNode(oldEndNode, newStartNode)
            // 移动节点 把当前的 旧后elm移动到 旧前的elm 的前面
            if (isHTML(oldEndNode.elm) && isHTML(oldStartNode.elm)) {
                parent.insertBefore(oldEndNode.elm, oldStartNode.elm)
            }
            newStartNode = newChildren[++newStartIdx]
            oldEndNode = oldChildren[--oldEndIdx]
        } else {
            // 创建缓存map
            if (isUndefined(oldKeyCache)) {
                oldKeyCache = getIdxMap(oldStartIdx, oldEndIdx, oldChildren)
            }
            const findOldIdx = oldKeyCache.get(newStartNode.attribute?.key.toString())
            // 如果找到了。则说明当前是更换了位置的
            if (!isUndefined(findOldIdx)) {
                const findOldNode = oldChildren[findOldIdx]
                // 将当前项设置为 移动节点
                patchVNode(findOldNode, newStartNode)
                // 移动节点。将找到的旧的节点移动到旧的开始节点的前面
                if (isHTML(findOldNode.elm) && isHTML(oldStartNode.elm)) {
                    parent.insertBefore(findOldNode.elm, oldStartNode.elm)
                }
                // 将当前找到的节点修改为undefined
                oldChildren[findOldIdx] = undefined as any

            } else {
                // 说明是新增的。将新的节点插入到旧的开始节点的前面
                if (isHTML(oldStartNode.elm)) {
                    const newElm = createElement(newStartNode)
                    parent.insertBefore(newElm, oldStartNode.elm)
                }
            }

            newStartNode = newChildren[++newStartIdx]
        }
    }

    // 这个时候 oldVNode 处理完成了。newVNode 中剩余的就是新增的
    if (newStartIdx <= newEndIdx) {
        // XXX：如果 insertBefore 的元素是null 则会自动插入到最后一个。效果与 appendChildren 类似
        // before 表示当前为处理节点的下一个节点。需要吧节点插入到这个节点之前。也就是插入到新后的后面。如果新后是最后一个
        const before = (newChildren[newEndIdx + 1]?.elm ?? null) as Node
        // 遍历添加为处理的元素。从 newStartIdx 开始。newEndIdx 结束
        for (; newStartIdx <= newEndIdx; ++newStartIdx) {  // for 中 i++ 与  ++i 效果是一致的。但是 i++ 执行时需要申请内存 ++i不需要
            const item = newChildren[newStartIdx]
            if (!isUndefined(item)) {
                parent.insertBefore(createElement(item), before)
            }
        }
    }

    // 这个时候 newVNode 处理完成了。那么 oldVNode中剩余没有处理的就是删除的
    if (oldStartIdx <= oldEndIdx) {
        // 删除从开始到结束。这中间的表示未处理的
        for (; oldStartIdx <= oldEndIdx; ++oldStartIdx) {
            const item = oldChildren[oldStartIdx]
            if (item && !isUndefined(item.elm)) {
                parent.removeChild(item.elm as Node)
            }
        }
    }
}
