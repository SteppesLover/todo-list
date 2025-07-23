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
      <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        ref={todoTitleInput}
      />
    <StyledButton disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Add Todo'}
    </StyledButton>
    </StyledForm>
  );
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
`;

const StyledButton = styled.button`
  padding: 0.5rem;
  background-color: teal;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-style: ${props => props.disabled ? 'italic' : 'normal'};
`;

export default TodoForm;
