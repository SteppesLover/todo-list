import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TodoListItem from './TodoListItem';
import styled from 'styled-components';
import styles from '../../../App.module.css';

function TodoList({ todoList, onUpdateTodo, onCompleteTodo, isLoading }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const itemsPerPage = 15;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const totalPages = Math.ceil(todoList.length / itemsPerPage);

  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const currentTodos = todoList.slice(indexOfFirstTodo, indexOfFirstTodo + itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: currentPage - 1 });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: currentPage + 1 });
    }
  };

  useEffect(() => {
    if (totalPages > 0) {
      if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
        navigate('/');
      }
    }
  }, [currentPage, totalPages, navigate]);

  return (
    <div>
      {isLoading ? (
        <p>Todo list loading...</p>
      ) : (
        <>
          {todoList.length === 0 ? (
            <p>No todos yet</p>
          ) : (
            <>
              <StyledList className={styles.list}>
                {currentTodos.map((todo) => (
                  <TodoListItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={onUpdateTodo}
                    onComplete={onCompleteTodo}
                  />
                ))}
              </StyledList>

              <PaginationControls>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                  Next
                </button>
              </PaginationControls>
            </>
          )}
        </>
      )}
    </div>
  );
}

const StyledList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;

  button {
    padding: 4px 12px;
    font-size: 14px;
  }

  span {
    font-size: 14px;
  }
`;

export default TodoList;
