import { useEffect, useState } from 'react'
import './App.css'
import h from './utils/diff/h'
import { patch } from './utils/diff/patch'
import { VNode } from './utils/diff/vNode'


function App (): JSX.Element {
    const [count, setCount] = useState(0)

    const container: HTMLElement = document.querySelector('.fuck') ?? document.createElement('div')

    let vNode: VNode

    const getVNode = (): HTMLElement | VNode => vNode ?? document.querySelector('.fuck') as HTMLElement

    useEffect(() => {
        vNode = patch(getVNode(), h('ul', [
            h('li',{ key: 1 }, '1'),
            h('li',{ key: 2 }, '2'),
            h('li',{ key: 3 }, '3'),
            h('li',{ key: 8 }, '8'),
            h('li',{ key: 5 }, '5'),
            h('li',{ key: 4 }, '4'),
        ]))
    })

    return (
        <div className="App">
            <div className="fuck"/>
            <button type="button" onClick={ () => {
                patch(getVNode(), h('ul', [
                    h('li',{ key: 4 }, '4'),
                    h('li',{ key: 5 }, '5'),
                    h('li',{ key: 8 }, '8'),
                    h('li',{ key: 3 }, '3'),
                    h('li',{ key: 2 }, '2'),
                    h('li',{ key: 1 }, '1'),
                ]))
            } }>新前与旧后相同
            </button>
        </div>
    )
}

export default App
