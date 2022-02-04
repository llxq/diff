import { useEffect, useState } from 'react'
import './App.css'
import h from './utils/diff/h'
import { patch } from './utils/diff/patch'
import { VNode } from './utils/diff/vNode'
import { observer } from './utils/observer'
import { watch } from './utils/observer/Watcher'


function App (): JSX.Element {
    const [count, setCount] = useState(0)

    const container: HTMLElement = document.querySelector('.fuck') ?? document.createElement('div')

    let vNode: VNode

    const getVNode = (): HTMLElement | VNode => vNode ?? document.querySelector('.fuck') as HTMLElement

    useEffect(() => {
        vNode = patch(getVNode(), h('ul', [
            h('li', { key: 1 }, '1'),
            h('li', { key: 2 }, '2'),
            h('li', { key: 3 }, '3'),
            h('li', { key: 4 }, '4'),
        ]))

        const obj: any = {
            b: [1, 2, 3],
            c: {
                b: 12
            }
        }
        observer(obj)

        watch(obj, 'b', () => {
            console.log('11')
        })
        watch(obj, 'c.b', () => {
            console.log('c.b update')
        })

        obj.b.push(5)

        obj.c.b = 21
    })

    return (
        <div className="App">
            <div className="fuck"/>
            <button type="button" onClick={ () => {
                patch(getVNode(), h('ul', [
                    h('li', { key: 4 }, '4'),
                    h('li', { key: 5 }, '5'),
                    h('li', { key: 3 }, '3'),
                    h('li', { key: 2 }, '2'),
                    h('li', { key: 1 }, '1'),
                ]))
            } }>新前与旧后相同
            </button>
        </div>
    )
}

export default App
