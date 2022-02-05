import Observer from './Observer'
import { Dep } from './Dep'

export const observer = (value: any): UndefinAble<Observer> => {
    if (typeof value !== 'object') return
    let ob = Reflect.get(value, '__ob__')
    if (!ob || !(ob instanceof Observer)) {
        ob = new Observer(value)
    }
    return ob
}

/**
 * 属性get/set劫持
 * @param obj 拦截的源
 * @param key 拦截的源的key
 * @param val 拦截的源的值
 */
export function defineReactive (obj: Obj, key: string, val?: any): void {
    // getOwnPropertyDescriptor: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
    // 获取obj上的key的描述信息，如果设置了不可修改则直接返回
    const descriptor = Object.getOwnPropertyDescriptor(obj, key)
    if (descriptor?.configurable === false) return

    // 获取当前对象所对应的key的读取器
    const getter = descriptor?.get

    // 如果第三个参数没有传递，并且没有设置读取器  则从 key上获取值，如果设置了读取器，下面的value在get的时候会从读取器中获取。这样后续可以保证用户可以通过读取器对数据进行进一步的拦截。如果没有设置读取器，则手动读取即可，下面操作的也都是 val
    if (arguments.length === 2 && !getter) {
        val = Reflect.get(obj, key)
    }

    // 如果子元素的值为对象也需要转化为 observer
    const childOb: UndefinAble<Observer> = observer(val)

    const dep = new Dep()

    Object.defineProperty(obj, key, {
        // 是否可以被枚举
        enumerable: true,
        // 是否可以修改/删除
        configurable: true,
        get (): any {
            // 如果有读取器就从读取器中获取
            const value = getter ? getter.call(obj) : val
            if (Dep.target) {
                // 这个时候的 target 指向当前观察者。将当前观察者放入到 obj[key] 对应的 dep 的subs中
                dep.depend()
                // 通知子元素更新
                childOb?.dep.depend()
            }
            return value
        },
        set (newValue: any): void {
            // 判断新旧值是否相同
            const value = getter ? getter.call(obj) : val
            if (newValue === value) return
            // 给新的值转化为observer
            observer(newValue)
            val = newValue
            // 通知所有观察者更新
            dep.notify()
        }
    })
}
