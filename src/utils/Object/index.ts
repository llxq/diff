import { isArray, isEqual, isNull, isObject, isUndefined } from 'lodash'

type Keys<T> = T extends (infer U)[] ? U : T[Extract<keyof T, string>]

type Callback<T extends Obj> = (item: Keys<T>, index: number, source?: T) => boolean | void

/**
 * 判断当前值是否存在对象中
 * @param value 值
 * @param object 判断的值
 * @param compareEmpty 是否需要对比空
 * @returns 返回是否存在
 */
export const containsValue = <T extends Obj>(value: unknown, object: T, compareEmpty = false): boolean => {

    if (compareEmpty) {
        if (isUndefined(value) || isNull(object)) return isUndefined(object) || isNull(object)
    }

    if ((isArray(value) || isObject(value)) && isEqual(value, object)) return true

    if (isArray(object)) {
        // 数组遍历
        for (let i = 0; i < object.length; i++) {
            const isFind = containsValue(value, object[i])
            if (isFind) return true
        }
    } else if (isObject(object)) {
        for (const key in object) {
            if (object.hasOwnProperty(key) && key !== 'constructor') {
                const isFind = containsValue(value, object[key])
                if (isFind) return true
            }
        }
    } else {
        return value === object
    }


    return false
}

/**
 * 遍历对象或者数组
 * @param source 需要遍历的对象
 * @param callback 回调 (item, index, source) => bolean | void
 */
export const each = <T extends Obj>(source: T, callback: Callback<T>): void => {
    if (isArray(source)) {
        for (let i = 0; i < source.length; i++) {
            if (callback(source[i], i)) return
        }
    } else if (isObject(source)) {
        let index = -1
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (callback(source[key], ++index)) return
            }
        }
    } else {
        callback(source, -1)
    }
}
