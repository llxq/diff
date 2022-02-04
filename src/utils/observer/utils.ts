export const hasProto = '__proto__' in window

export const hasSetPrototypeOf = 'setPrototypeOf' in Object

// 将一个属性挂载到某个对象上，并且修改部分描述对象
export const def = (target: any, key: string, value: any, enumerable?: boolean): void => {
    Object.defineProperty(target, key, {
        value,
        enumerable: !!enumerable,
        configurable: true,
        writable: true
    })
}

export function parsePath (path: string): any {
    const segments = path.split('.')
    return function (obj: any): any {
        for (let i = 0; i < segments.length; i++) {
            if (!obj) return
            obj = obj[segments[i]]
        }
        return obj
    }
}
