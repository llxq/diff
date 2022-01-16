import { TagKey, vNode, VNode } from './VNode'

export const primitive = (type: unknown): type is string | number => {
    return typeof type === "string" ||
        typeof type === "number" ||
        type instanceof String ||
        type instanceof Number;
}

export const isUndefined = (type: unknown): type is undefined =>
    typeof type === 'undefined' && type === undefined

export const isArray = <T = any>(type: unknown): type is Array<T> =>
    typeof type === 'object' && type instanceof Array && Array.isArray(type)

export const isVnode = (type: unknown): type is VNode =>
    !isUndefined((type as VNode).selector)

export const isHTML = (type: unknown): type is HTMLElement =>
    type instanceof HTMLElement

export const emptyNodeAt = (element: HTMLElement): VNode => {
    const tagNaem = element.tagName.toLocaleLowerCase() as TagKey
    return vNode(tagNaem, {}, [], undefined, element)
}

export const sameVnode = (newVnode: VNode, oldVnode: VNode): boolean => {
    return newVnode.selector === oldVnode.selector && newVnode.key === oldVnode.key
}
