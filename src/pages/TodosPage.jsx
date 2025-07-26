import TodoForm from './TodosPage/TodoForm';
import TodoList from './TodosPage/TodoList/TodoList';
import TodoViewForm from './TodosPage/TodoViewForm';
import styled from 'styled-components';
import styles from '../App.module.css';

function TodosPage({ todoState = {}, dispatch, addTodo, updateTodo, completeTodo, todoActions = {} }) {
  const {
    isSaving = false,
    isLoading = false,
    todoList = [],
    errorMessage = '',
    sortField = '',
    sortDirection = '',
    queryString = ''
  } = todoState;

  return (
    <>
      <TodoForm onAddTodo={addTodo} isSaving={isSaving} />

      <TodoList
        todoList={todoList.filter(todo => !todo.isCompleted)}
        onUpdateTodo={updateTodo}
        onCompleteTodo={completeTodo}
        isLoading={isLoading}
      />
      
      <TodoViewForm
        sortField={sortField}
        setSortField={(val) => dispatch?.({ type: todoActions.setSortField, payload: val })}
        sortDirection={sortDirection}
        setSortDirection={(val) => dispatch?.({ type: todoActions.setSortDirection, payload: val })}
        queryString={queryString}
        setQueryString={(val) => dispatch?.({ type: todoActions.setQueryString, payload: val })}
      />

      {errorMessage && (
        <StyledError>
          <img src="/icons/error.svg" alt="Error icon" width={20} height={20} />
          <hr />
          <p>{errorMessage}</p>
          <button
            className={styles.errorDismiss}
            onClick={() => dispatch?.({ type: todoActions.clearError, payload: "" })}
          >
            Dismiss
          </button>
        </StyledError>
      )}
    </>
  );
}

const StyledError = styled.div`
  display: flex;
  align-items: center;
  color: red;
  gap: 8px;
  font-size: 14px;
  margin-top: 4px;
`;

export default TodosPage;