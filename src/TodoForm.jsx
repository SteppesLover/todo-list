import { useState } from 'react';
import { useRef } from 'react';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const todoTitleInput = useRef();

  function handleAddTodo(event) {
    event.preventDefault();              
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle("");                                
    todoTitleInput.current.focus();                  
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        id="todoTitle"
        name="title"                        
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        ref={todoTitleInput}
      />
      <button type="submit" disabled={workingTodoTitle === ""}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
