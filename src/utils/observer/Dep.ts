import Watcher from './Watcher'

let id = 0

export class Dep {
    static target: NullAble<Watcher> = null

    public id: number

    public subs: Array<Watcher> = []

    constructor () {
        this.id = id++
    }

    public remove (id: number): void {
        const index = this.subs.findIndex(it => it.id === id)
        index > -1 && this.subs.splice(index, 1)
    }

    public addSub (watcher: Watcher): void {
        this.subs.push(watcher)
    }

    public depend (): void {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    public notify (): void {
        const length = this.subs.length
        for (let i = 0; i < length; i++) {
            this.subs[i].update()
        }
    }
}

const depStacks: Array<Watcher> = []

export const pushDepStack = (watch: Watcher): void => {
    Dep.target = watch
    depStacks.push(watch)
}

export const popDepStack = (): void => {
    depStacks.pop()
    Dep.target = depStacks[depStacks.length - 1] ?? null
}
