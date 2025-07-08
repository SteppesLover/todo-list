import { useState } from 'react';
import { useRef } from 'react';

function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState(""); 
  const todoTitleInput = useRef();

  function handleAddTodo(event) {
    event.preventDefault();              
    const title = event.target.title.value;
    onAddTodo(title);
    event.target.title.value = "";
    setTitle("");                                
    todoTitleInput.current.focus();                  
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        id="todoTitle"
        name="title"                        
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        ref={todoTitleInput}
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;
