import { useState, useEffect } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel';
import styled from 'styled-components';
import styles from './TodoListItem.module.css';

function TodoListItem({ todo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    event.preventDefault();
    if (!isEditing) return;

    onUpdateTodo({ ...todo, title: workingTitle });
    setIsEditing(false);
  }

  return (
    <li className={styles.item}>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`todo-${todo.id}`}
              labelText="Edit Todo"
              value={workingTitle}
              onChange={handleEdit}
            />
            <button type="button" onClick={handleCancel}> Cancel </button>
            <button type="button" onClick={handleUpdate}> Update </button>
          </>
        ) : (
          <>
            <label htmlFor={`checkbox${todo.id}`}>
            <StyledCheckboxWrapper onClick={() => onUpdateTodo({ ...todo, isCompleted: !todo.isCompleted })}>
              <HiddenCheckbox
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => {}}
                id={`checkbox${todo.id}`}
              />
                {todo.isCompleted ? (
                  <img src="/icons/check.svg" alt="Checked" width={24} height={24} />
                ) : (
                  <img src="/icons/unchecked.svg" alt="Unchecked" width={24} height={24} />
                )}            
              </StyledCheckboxWrapper>
            </label>
            <span onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
              {todo.title}
            </span>
          </>
        )}
      </form>
    </li>
  );
}

  const StyledCheckboxWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

const HiddenCheckbox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

export default TodoListItem;