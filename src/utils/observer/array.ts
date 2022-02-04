import { def } from './utils'
import Observer from './Observer'

const arrayProto = Array.prototype

// 创建一个继承至Array的对象
export const arrayMethod = Object.create(arrayProto)

// 拦截的数组方法
const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]

methodsToPatch.forEach(method => {
    const originMethod = Reflect.get(arrayProto, method)
    // 给 arrayMethods 挂载这几个方法
    def(arrayMethod, method, function (this: Array<any>): any {
        const result = originMethod.apply(this, arguments)
        // 获取当前数组的 observer 对象。进入到这里说明当前数组已经转化完成，带有observer
        const ob: Observer = Reflect.get(this, '__ob__')
        // 处理特殊方法。
        switch (method) {
            case 'push':
            case 'unshift':
                // 这两个都是添加的。需要将添加的值转化为observer
                ob.observerArray(Array.from(arguments))
                break
            case 'splice':
                // 获取splice的对象。splice新增/修改都是第三个参数，所以直接获取第三个参数即可
                const newValue = Array.from(arguments).splice(2)
                newValue.length && ob.observerArray(newValue)
        }
        // 通知依赖更新
        ob.dep.notify()
        return result
    })
})
