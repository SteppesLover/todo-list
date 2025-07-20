import './App.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import TodoViewForm  from './features/TodoViewForm.jsx';
import { useState, useEffect, useCallback } from 'react';


function App() {
  const [todos, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [sortField, setSortField] = useState("createdTime");
  const [sortDirection, setSortDirection] = useState("desc");
  const [queryString, setQueryString] = useState("")
 
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const encodeURL = useCallback(() => {
  let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;

  let searchQuery = "";
  if (queryString) {
    searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`;
  }

  return encodeURI(`${url}?${sortQuery}${searchQuery}`);
}, [sortField, sortDirection, queryString, url]);


  function updateErrorMessage(message) {
    setErrorMessage(message);
  }

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(encodeURL({ sortField, sortDirection, url, queryString })
, options);

        if (!resp.ok) {
          throw new Error(resp.message);
        }

        const { records } = await resp.json();

        const todos = records.map((record) => {
          const todo = {
            id: record.id,
            title: record.fields.title,
            ...record.fields,
          };

          if (todo.isCompleted === undefined) {
            todo.isCompleted = false;
          }

          return todo;
        });

        setTodoList(todos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [sortField, sortDirection, url, queryString, token]);

  async function updateTodo(editedTodo) {
  setIsSaving(true);

  const originalTodo = todos.find((todo) => todo.id === editedTodo.id);

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
    const resp = await fetch(encodeURL({ sortField, sortDirection, url, queryString }), options);

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      const errorMessage = errorData?.error?.message || `HTTP error! Status: ${resp.status}`;
      throw new Error(errorMessage);
    }

    const { records } = await resp.json();

    const updatedTodo = {
      id: records[0].id,
      title: records[0].fields.title,
      isCompleted: records[0].fields.isCompleted ?? false,
    };

    const updatedTodos = todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );

    setTodoList(updatedTodos);
    } catch (error) {
    console.error("Error updating todo:", error);
    setErrorMessage(`${error.message}. Reverting todo...`);

    const revertedTodos = todos.map((todo) =>
      todo.id === originalTodo.id ? originalTodo : todo
    );

    setTodoList(revertedTodos);
    } finally {
      setIsSaving(false);
    }
  }

  const addTodo = async ({ title, isCompleted }) => {
  setIsSaving(true);

  const payload = {
    records: [
      {
        fields: {
          title: title,
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
    const resp = await fetch(encodeURL({ sortField, sortDirection, url, queryString }), options);

    if (!resp.ok) {
        throw new Error(resp.message);
    }

    const { records } = await resp.json();
    const savedTodo = {
    id: records[0].id,
    title: records[0].fields.title,
    isCompleted: records[0].fields.isCompleted ?? false,
    };

   setTodoList(prevTodos => [...prevTodos, savedTodo]);
  } catch (error) {
    console.error("Error saving todo:", error);
    setErrorMessage(error.message);
  } finally {
    setIsSaving(false);
  }
};

  return (
    <div>
      <h1>Todo List</h1>

      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

      <TodoList
        todoList={todos}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
        <hr />
        <TodoViewForm
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          queryString={queryString}
          setQueryString={setQueryString}
        />

      {errorMessage && (
        <div className="error-message">
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Dismiss</button>
        </div>
      )}
    </div>
  );
}


export default App;

