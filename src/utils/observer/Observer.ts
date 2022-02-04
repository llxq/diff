import { isArray } from '../diff/utils'
import { each } from '../Object'
import { defineReactive, observer } from './index'
import { arrayMethod } from './array'
import { def, hasProto, hasSetPrototypeOf } from './utils'
import { Dep } from './Dep'

export default class Observer {
    public dep: Dep
    constructor (value: any) {
        // 设置 __ob__ 属性，并且设置不可枚举
        def(value, '__ob__', this)
        // 用来给通知数组的依赖
        this.dep = new Dep()
        // 转化为响应式
        if (isArray(value)) {
            // 数组
            if (hasSetPrototypeOf) {
                Object.setPrototypeOf(value, arrayMethod)
            } else {
                (hasProto ? this.updateProto : this.replaceArrayMethods)(value)
            }
            // 需要将数组的每一项转化为observer
            this.observerArray(value)
        } else {
            this.walk(value)
        }
    }

    private walk (value: Object): void {
        // Reflect.ownKeys() 返回的是 Array<string | Symbol>。。。
        const keys = Object.keys(value)
        each(keys, key => {
            defineReactive(value, key)
        })
    }

    private updateProto = (target: any): void => {
        target.__proto__ = arrayMethod
    }

    private replaceArrayMethods = (target: Array<any>): void => {
        // 获取 arrayMethods 上的属性，也就是我们在 array.ts 中挂载的那几个方法。不使用 Object.keys 是因为设置的那几个属性为不可枚举
        // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
        const keys = Object.getOwnPropertyNames(arrayMethod)
        each(keys, key => {
            // 拦截当前数组中的那几个方法
            def(target, key, arrayMethod[key])
        })
    }

    // 将数组转化为observer
    public observerArray (array: Array<any>) {
        // 防止遍历过程中 length 变了
        const length = array.length
        for (let i = 0; i < length; i++) {
            observer(array[i])
        }
    }

}
