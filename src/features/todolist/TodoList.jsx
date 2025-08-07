import TodoListItem from "./TodoListItem";

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

export default TodoList;
