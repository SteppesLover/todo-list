import './App.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import { useState } from 'react';

function App() {
  const [todos, setTodoList] = useState([]); 
  
function updateTodo(editedTodo) {
  const updatedTodos = todos.map((todo) => {
    if (todo.id === editedTodo.id) {
      return { ...editedTodo };
    }
    return todo;
  });

  setTodoList(updatedTodos);
}

  function completeTodo(id){
  const updatedTodos = todos.map((todo) => {
  if(todo.id===id){
    return {...todo, isCompleted: true}
  }
  return todo;  
  });

  setTodoList(updatedTodos);
  }

  function addTodo(title) {
    const newTodo = { title, id: Date.now(), isCompleted: false };
    setTodoList([...todos, newTodo]);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todos} onCompleteTodo={completeTodo}   onUpdateTodo={updateTodo} />
    </div>
  );
}


export default App;

