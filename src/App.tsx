import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Render from './utils/Mustache/Render';


function App (): JSX.Element {
    const [count, setCount] = useState(0)
    const template = `
     <div>
        <p>{{ a.b }}</p>
        <p>{{ name }}</p>
        <ul>
            {{ #list }}
            <li>
                姓名：{{ name }}
            </li>
            <li>
                年龄：{{ age }}
            </li>
            <ul>
                {{ #hobbies }}
                <li>{{ . }}</li>
                {{ /hobbies }}
            </ul>
            {{ /list }}
        </ul>
    </div>
    `
    const data = {
        name: '这个是非list字段',
        list: [
            {
                name: '张三',
                age: 12,
                hobbies: ['1', '2']
            },
            {
                name: '李四',
                age: 15,
                hobbies: ['111', '2222']
            }
        ],
        a: {
            b: 1234
        }
    }

    const render = new Render(template, data)

    return (
        <div className="App">
            <div dangerouslySetInnerHTML = {{ __html: render.render() }}></div>
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
