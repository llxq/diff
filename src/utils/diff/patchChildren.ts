import { VNode } from "./vNode";

export const patchChildren = (oldChildren: VNode[], newChildren: VNode[], elm: HTMLElement): void => {
    let newStartIdx = 0
    let oldStartIdx = 0

    let newEndIdx = newChildren.length - 1
}