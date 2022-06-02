import type { ReactElement } from 'react'
import React from 'react'
import { useRecoilState } from 'recoil'

import type { AppState, Routes, Todo } from '../../dataStructure'
import { recoilState } from '../../dataStructure'

import Item from './Item'
import { Layout } from './style'
import axios from "axios"

interface Props {
  path: Routes
}

const TodoList: React.FC<Props> = ({ path }) => {
  const [appState, setAppState] = useRecoilState<AppState>(recoilState)

  React.useEffect(() => {
    axios.get('http://localhost:5000/api/todos', {
      headers: {
        "Content-Type": "application/json"
      },
      params: {
        "all": true
      }
    }).then(function(res) {
      const todos: Todo[] = []
      res.data.forEach((d: any) => {
        todos.push({ id: d.entityId, bodyText: d.bodyText, completed: d.completed })
      })
      setAppState({ todoList: todos })
    }).catch(function (err) {
      console.error(err)
    })
  }, [])

  function toggleAllCheckbox(e: React.ChangeEvent<HTMLInputElement>): void { /* eslint-disable-line prettier/prettier */
    // reverse all todo.completed: boolean flag
    setAppState({ todoList: appState.todoList.map((t: Todo): Todo => ({ ...t, completed: e.target.checked })) }) /* eslint-disable-line prettier/prettier */
  }

  return (
    <Layout>
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={toggleAllCheckbox}
          data-cy="toggle-all-btn"
          data-testid="toggle-all-btn"
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list" data-testid="todo-list">
          {appState.todoList && appState.todoList
            .filter((t: Todo): boolean => {
              switch (path) {
                case '/':
                  return true
                case '/active':
                  return t.completed === false
                case '/completed':
                  return t.completed === true
                default:
                  return true
              }
            })
            .map((t: Todo): ReactElement => {
              return <Item key={t.id} todo={t} />
            })}
        </ul>
      </section>
    </Layout>
  )
}

export default TodoList
