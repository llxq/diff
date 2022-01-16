import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Render from './utils/Mustache/Render';
import h from './utils/diff/h'
import { patch } from './utils/diff/patch';


function App (): JSX.Element {
    const [count, setCount] = useState(0)

    // h('div', 'text')
    console.log(h('div', 'text'))
    console.log(h('div', {class: '1234'}, [
        h('span', '123')
    ]))

    const container = document.createElement('div')

    document.body.appendChild(container)
    

    patch(container, h('span', '1234'))

    return (
        <div className="App">
            <header className="App-header">
                <img src={ logo } className="App-logo" alt="logo"/>
                <p>Hello Vite + React!</p>
                <p>
                    <button type="button" onClick={ () => setCount((count) => count + 1) }>
                        count is: { count }
                    </button>
                </p>
                <p>
                    Edit <code>App.tsx</code> and save to test HMR updates.
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
                    { ' | ' }
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
