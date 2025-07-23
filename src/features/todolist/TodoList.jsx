import TodoListItem from "./TodoListItem";
import styles from './TodoList.module.css';
import styled from 'styled-components';

function TodoList({ todoList, onUpdateTodo, isLoading }) {
  
  return (
    <div>
      {isLoading ? (
        <p>Todo list loading...</p>
      ) : (
        <>
          {todoList.length === 0 ? (
            <p>No todos yet</p>
          ) : (
            <ul>
              {todoList.map((todo) => (
                <TodoListItem
                  key={todo.id}
                  todo={todo}
                  onUpdateTodo={onUpdateTodo}
                />
              ))}
            </ul>
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
