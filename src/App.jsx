import './App.css';
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import { useState } from 'react';

function App() {
  const [filteredTodos, setTodoList] = useState([]); 

  function completeTodo(id){
  const updatedTodos = filteredTodos.map((todo) => {
  if(todo.id===id){
    return {...todo, isCompleted: true}
  }
  return todo;  
  });

  setTodoList(updatedTodos);
  }

  function addTodo(title) {
    const newTodo = { title, id: Date.now(), isCompleted: false };
    setTodoList([...filteredTodos, newTodo]);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={filteredTodos} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App;
