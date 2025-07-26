import './App.css';
import styles from './App.module.css';
import styled from "styled-components";
import { useReducer, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import TodosPage from './pages/TodosPage';
import Header from './shared/Header';
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer.js';

function App() {
  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const [title, setTitle] = useState('');
  const location = useLocation();
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
    if (location.pathname === '/') {
      setTitle('Todo List');
    } else if (location.pathname === '/about') {
      setTitle('About');
    } else {
      setTitle('Not Found');
    }
  }, [location]);

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

        if (!resp.ok) throw new Error(resp.statusText);

        const { records } = await resp.json();

        dispatch({
          type: todoActions.loadTodos,
          records,
        });
      } catch (error) {
        dispatch({
          type: todoActions.clearError,
          payload: error.message,
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
      records: [{ fields: { title, isCompleted: isCompleted ?? false } }],
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
      if (!resp.ok) throw new Error(resp.statusText);

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
        type: todoActions.clearError,
        payload: error.message,
      });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const updateTodo = async (editedTodo) => {
    dispatch({ type: todoActions.startRequest });

    const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id);

    const payload = {
      records: [{ id: editedTodo.id, fields: editedTodo }],
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
      dispatch({ type: todoActions.updateTodo, payload: editedTodo });
    } catch (error) {
      dispatch({ type: todoActions.revertTodo, payload: originalTodo });
      dispatch({ type: todoActions.clearError, payload: error.message });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  const completeTodo = async (todo) => {
    dispatch({ type: todoActions.startRequest });

    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };

    const payload = {
      records: [{ id: updatedTodo.id, fields: { isCompleted: updatedTodo.isCompleted } }],
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
      dispatch({ type: todoActions.completeTodo, payload: updatedTodo });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, payload: error.message });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  return (
    <div className={styles.appContainer}>
      <StyledHeader>
        <img src="/images/logo.svg" alt="Logo" width="40" height="40" />
      </StyledHeader>
      <>
      <Header title={title} />
      </>
      <TodosPage
        todoState={todoState}
        dispatch={dispatch}
        addTodo={addTodo}
        updateTodo={updateTodo}
        completeTodo={completeTodo}
        todoActions={todoActions}
      />
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
