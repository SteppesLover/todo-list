import TodoListItem from "./TodoListItem";
import styles from './TodoList.module.css';
import styled from 'styled-components';

function TodoList({ todoList, onUpdateTodo, onCompleteTodo, isLoading }) {
  
  return (
    <div>
      {isLoading ? (
        <p>Todo list loading...</p>
      ) : (
        <>
          {todoList.length === 0 ? (
            <p>No todos yet</p>
          ) : (
            <StyledList className={styles.list}>
              {todoList.map((todo) => (
                <TodoListItem
                  key={todo.id}
                  todo={todo}
                  onUpdateTodo={onUpdateTodo}
                  onCompleteTodo={onCompleteTodo}
                />
              ))}
            </StyledList>
          )}
        </>
      )}
    </div>
  );
}

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export default TodoList;
