import { TagKey, vNode, VNode } from './vNode'

export const primitive = (type: unknown): type is string | number => {
    return typeof type === 'string' ||
        typeof type === 'number' ||
        type instanceof String ||
        type instanceof Number
}

export const isUndefined = (type: unknown): type is undefined =>
    typeof type === 'undefined' && type === undefined

export const isArray = <T = any> (type: unknown): type is Array<T> =>
    typeof type === 'object' && type instanceof Array && Array.isArray(type)

export const isVNode = (type: unknown): type is VNode =>
    !isUndefined((type as VNode).selector)

export const isHTML = (type: unknown): type is HTMLElement =>
    type instanceof HTMLElement

export const emptyNodeAt = (element: HTMLElement): VNode => {
    const tagName = element.tagName.toLocaleLowerCase() as TagKey
    return vNode(tagName, {}, [], undefined, element)
}

export const sameVNode = (newVNode: VNode, oldVNode: VNode): boolean => {
    return newVNode.selector === oldVNode.selector && newVNode.key === oldVNode.key
}

export const trim = (value: string | number): string => {
    return value.toString().trim()
}
