import './App.css';
import styles from './App.module.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import TodoViewForm  from './features/TodoViewForm.jsx';
import { useReducer, useEffect, useCallback } from 'react';
import styled from "styled-components";
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer.js';


function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
const token = `Bearer ${import.meta.env.VITE_PAT}`;

const encodeURL = useCallback(() => {
  let sortQuery = `sort[0][field]=${todoState.sortField}&sort[0][direction]=${todoState.sortDirection}`;
  let searchQuery = "";

  if (todoState.queryString) {
    searchQuery = `&filterByFormula=SEARCH("${todoState.queryString}",+title)`;
  }

  return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [url, todoState.sortField, todoState.sortDirection, todoState.queryString]);

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });

      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(encodeURL(), options);

        if (!resp.ok) {
          throw new Error(resp.statusText);
        }

        const { records } = await resp.json();

        dispatch({
          type: todoActions.loadTodos,
          records,
        });
      } catch (error) {
        dispatch({
          type: todoActions.setLoadError,
          error,
        });
      } finally {
        dispatch({ type: todoActions.endRequest });
      }
    };

    fetchTodos();
  }, [encodeURL, token]);

  const addTodo = async ({ title, isCompleted }) => {
    dispatch({ type: todoActions.startRequest });

    const payload = {
      records: [
        {
          fields: {
            title,
            isCompleted: isCompleted ?? false,
          },
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeURL(), options);

      if (!resp.ok) {
        throw new Error(resp.statusText);
      }

      const { records } = await resp.json();

      dispatch({
        type: todoActions.addTodo,
        payload: {
          id: records[0].id,
          title: records[0].fields.title,
          isCompleted: records[0].fields.isCompleted ?? false,
        },
      });
    } catch (error) {
      dispatch({
        type: todoActions.setLoadError,
        error,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  async function updateTodo(editedTodo) {
    dispatch({ type: todoActions.startRequest });

    const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id);

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      await fetch(encodeURL(), options);

      dispatch({
        type: todoActions.updateTodo,
        payload: editedTodo,
      });
    } catch (error) {
      dispatch({
        type: todoActions.revertTodo,
        payload: originalTodo,
      });

      dispatch({
        type: todoActions.setLoadError,
        error,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  }

  function completeTodo(todo) {
    const updatedTodo = {
      ...todo,
      isCompleted: !todo.isCompleted,
    };

    updateTodo(updatedTodo);
  }

  return (
  <div className={styles.appContainer}>
    <StyledHeader>
      <img src="/images/logo.svg" alt="Logo" width="40" height="40" />
      Todo List
    </StyledHeader>

    <TodoForm onAddTodo={addTodo} isSaving={todoState.isSaving} />

    <TodoList
      todoList={todoState.todoList.filter(todo => !todo.isCompleted)}
      onUpdateTodo={updateTodo}
      isLoading={todoState.isLoading}
    />

    <hr />

    <TodoViewForm
    sortField={todoState.sortField}
    setSortField={(val) => dispatch({ type: todoActions.setSortField, payload: val })}
    sortDirection={todoState.sortDirection}
    setSortDirection={(val) => dispatch({ type: todoActions.setSortDirection, payload: val })}
    queryString={todoState.queryString}
    setQueryString={(val) => dispatch({ type: todoActions.setQueryString, payload: val })}
    />

    {todoState.errorMessage && (
      <StyledError>
        <img src="/icons/error.svg" alt="Error icon" width={20} height={20} />
        <hr />
        <p>{todoState.errorMessage}</p>
        <button
          className={styles.errorDismiss}
          onClick={() => dispatch({ type: todoActions.setLoadError, error: "" })}
        >
          Dismiss
        </button>
      </StyledError>
    )}
    </div>
  );

}

  const StyledHeader = styled.h1`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StyledError = styled.div`
  display: flex;
  align-items: center;
  color: red;
  gap: 8px;
  font-size: 14px;
  margin-top: 4px;
`;


export default App;
