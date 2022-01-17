import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Render from './utils/Mustache/Render';
import h from './utils/diff/h'
import { patch } from './utils/diff/patch';
import { VNode } from './utils/diff/vNode';


function App(): JSX.Element {
    const [count, setCount] = useState(0)

    const container: HTMLElement = document.querySelector('.fuck') ?? document.createElement('div')

    let vnode: VNode


    const newContainer = h('div', { key: 123 }, [
        h('ul', {}, [
            h('li', '测试1'),
            h('li', '测试2'),
            h('li', '测试3')
        ])
    ])

    const oldContainer = h('div', [
        h('ul', [
            h('li', '测试4'),
            h('li', '测试5'),
            h('li', '测试6')
        ])
    ])

    const getOldVnode = (): HTMLElement | VNode => vnode ?? document.querySelector('.fuck') as HTMLElement

    return (
        <div className="App">
            <div className='fuck'></div>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Hello Vite + React!</p>
                <p>
                    <button type="button" onClick={() => setCount((count) => count + 1)}>
                        count is: {count}
                    </button>
                </p>
                <p>
                    <button type='button' onClick={() => {
                        vnode = patch(getOldVnode(), newContainer)
                    }}>patch1</button>

                    <button type='button' onClick={() => {
                        vnode = patch(getOldVnode(), oldContainer)
                    }}>patch2</button>


                    <button type='button' onClick={() => {
                        vnode = patch(getOldVnode(), h('div', { key: 3 }, '123'))
                    }}>patch3</button>

                    <button type='button' onClick={() => {
                        vnode = patch(getOldVnode(), h('div', [
                            h('ul', [
                                h('li', 'A'),
                                h('li', 'B'),
                                h('li', 'C'),
                                h('li', 'D')
                            ])
                        ]))
                    }}>patch4</button>

                    <button type='button' onClick={() => {
                        vnode = patch(getOldVnode(), h('div', '456'))
                    }}>patch5</button>

                    <button type='button' onClick={() => {
                        vnode = patch(getOldVnode(), h('div', '789'))
                    }}>patch6</button>

                    <button type='button' onClick={() => {
                        vnode = patch(getOldVnode(), h('div', {class: 'fuck - you'}))
                    }}>patch7</button>
                </p>
                <p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                    {' | '}
                    <a
                        className="App-link"
                        href="https://vitejs.dev/guide/features.html"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Vite Docs
                    </a>
                </p>
            </header>
        </div>
    )
}

export default App
