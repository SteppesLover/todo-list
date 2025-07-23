import { useState, useRef } from 'react';
import styled from 'styled-components';
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

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledButton = styled.button`
  padding: 0.5rem;
  background-color: teal;
  color: white;
  border: none;
  border-radius: 4px;
  font-style: ${({ disabled }) => (disabled ? 'italic' : 'normal')};
`;

export default TodoForm;
