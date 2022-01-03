import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Render from './utils/Mustache/Render';
import { get } from './utils/Object';


function App (): JSX.Element {
    const [count, setCount] = useState(0)
    const template = `
     <div>
        <p>{{ a }}</p>
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
                hobbies: {{ #hobbies }}
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

    console.log(get(data, 'list[1].name'))

    let obj = {
        a: 1
    }
    const list = ['a', 'b', 'c']
    console.log(list.reduce((result: any, current: any, index: number) => {
        const last = index === list.length - 1
        if (result && typeof result === 'object' && Reflect.has(result, current)) {
            const _result = result[current]
            if (!last && typeof _result !== 'object') {
                result[current] = {}
                return result[current]
            }
            return result[current]
        } else {
            result[current] = last ? 'last' : {}
        }
        return result
    }, obj))

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
