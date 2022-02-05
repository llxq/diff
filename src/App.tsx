import { useEffect, useState } from 'react'
import './App.css'
import { parseAst, parseHtml } from './utils/ast/parse'
import h from './utils/diff/h'
import { patch } from './utils/diff/patch'
import { VNode } from './utils/diff/vNode'
import { observer } from './utils/observer'
import { watch } from './utils/observer/Watcher'


function App(): JSX.Element {
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

        const html = `
        <div class="div1" data-a="abc" id='id1'>
            <h1>这是一个h1</h1>
            这有个div的文字呢
            <ul class="ul1">
                <li>1</li>
                <li>2</li>
                <li>3</li>
            </ul>
        </div>
        `
        const ast = parseAst(html)
        console.log(ast)
        const newHtml = parseHtml(ast)
        console.log(newHtml)
    })

    return (
        <div className="App">
            <div className="fuck" />
            <button type="button" onClick={() => {
                vNode = patch(getVNode(), h('div', { key: 'fuck' }, [
                    h("p", { key: "A" }, "1111"),
                    h("p", { key: "B" }, "2222"),
                    h("p", { key: "C" }, "3333")
                ]))
            }}>测试
            </button>


            <button type="button" onClick={() => {
                vNode = patch(getVNode(), h('div', { key: 'fuck' }, [
                    h("p", { key: "A" }, "1111"),
                    h("p", { key: "C" }, "3333"),
                    h("p", { key: "D" }, "4444"),
                    h("p", { key: "B" }, "2222")
                ]))
            }}>测试2
            </button>
        </div>
    )
}

export default App
