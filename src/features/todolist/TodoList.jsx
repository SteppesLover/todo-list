import TodoListItem from "./TodoListItem";

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  
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
                  onCompleteTodo={onCompleteTodo}
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

export default TodoList;
