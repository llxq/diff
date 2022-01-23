import { each } from '../Object'
import { trim } from './utils'

export const setAttribute = <T extends Obj>(attribute: T, elm: HTMLElement) => {
    const attributeKeys: string[] = Object.keys(attribute)
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
                each(trim(classNames).split(' '), (className: string) => {
                    elm.classList.add(className.trim())
                })
            }
        } else {
            elm.setAttribute(key, Reflect.get(attribute, key))
        }
    })
}
