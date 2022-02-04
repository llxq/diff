import { Dep, popDepStack, pushDepStack } from './Dep'
import { get } from '../Object'

type WatcherCallBack = (value?: any, oldValue?: any) => void

let id = 0

export default class Watcher {
    // 缓存的
    private deps: Array<Dep>
    private depIds: Set<number>
    // 当前正在处理的
    private newDepIds: Set<number>
    private newDeps: Array<Dep>
    private readonly getter: (obj: any) => any
    private readonly target: Obj
    private readonly callback?: WatcherCallBack
    private value: any
    public readonly id: number

    constructor (target: Obj, path: string | WatcherCallBack, callBack?: WatcherCallBack) {
        this.target = target
        this.getter = function (obj: Obj): any {
            return get(obj, typeof path === 'string' ? path : undefined)
        }
        this.callback = callBack
        this.id = id++
        this.newDepIds = new Set()
        this.depIds = new Set()
        this.deps = []
        this.newDeps = []
        this.value = this.get()
    }

    public addDep (dep: Dep): void {
        if (!this.newDepIds.has(dep.id)) {
            this.newDepIds.add(dep.id)
            this.newDeps.push(dep)
            // 如果当前需要通知的dep列表中没有的话，则添加
            if (!this.depIds.has(dep.id)) {
                dep.addSub(this)
            }
        }
    }

    private clearDep (): void {
        let i = this.deps.length
        // 当 i = 0 的时候会停止循环的
        while (i--) {
            const dep = this.deps[i]
            if (!this.newDepIds.has(dep.id)) {
                // 删除
                dep.remove(this.id)
            }
        }
        this.deps = this.newDeps
        this.depIds = this.newDepIds
        this.newDepIds = new Set()
        this.newDeps = []
    }

    public update (): void {
        // 通知更新
        const value = this.get()
        let oldValue = this.value
        // 如果是监听数组或者对象，新旧值是一样的
        if (typeof this.callback === 'function' && (this.value !== value || typeof value === 'object')) {
            this.callback.call(this.target, value, oldValue)
        }
        this.value = value
    }

    public get (): any {
        pushDepStack(this)
        // 这里去获取值
        let value
        try {
            value = this.getter.call(this.target, this.target)
        } catch (e) {
            console.error(e)
        }
        popDepStack()
        this.clearDep()
        return value
    }
}

export const watch = (source: Obj, path: string | WatcherCallBack, callback?: WatcherCallBack): Watcher => {
    return new Watcher(source, path, callback)
}
