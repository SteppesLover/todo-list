import { useState, useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState("");
  const todoTitleInput = useRef();

  async function handleAddTodo(event) {
    event.preventDefault();
    if (!workingTodoTitle.trim()) return;

    await onAddTodo({ 
      title: workingTodoTitle.trim(), 
      isCompleted: false 
    });

    setWorkingTodoTitle("");
    todoTitleInput.current.focus();
  }

  return (
      <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        ref={todoTitleInput}
      />
    <button disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Add Todo'}
    </button>
    </form>
  );
}

export default TodoForm;
