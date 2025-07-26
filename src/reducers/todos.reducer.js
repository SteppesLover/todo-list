const initialState = {
  todoList: [],
  isLoading: false,
  errorMessage: "",
  isSaving: false,
  sortField: "createdTime",
  sortDirection: "desc",
  queryString: "",
};

const actions = {
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',
  clearError: 'clearError',
  startRequest: 'startRequest',
  endRequest: 'endRequest',
  addTodo: 'addTodo',
  updateTodo: 'updateTodo',
  revertTodo: 'revertTodo',
  completeTodo: 'completeTodo',
  setSortField: 'setSortField',
  setSortDirection: 'setSortDirection',
  setQueryString: 'setQueryString',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };

     case actions.loadTodos:
      return {
        ...state,
        todoList: action.records.map((record) => ({
          id: record.id,
          title: record.fields.title,
          isCompleted: record.fields.isCompleted ?? false,
        })),
        isLoading: false,
      };

    case actions.setLoadError:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
        errorMessage: action.payload,
      };

    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
      };

    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
        errorMessage: '',
      };

    case actions.endRequest:
      return {
        ...state,
        isSaving: false,
        isLoading: false,
      };

    case actions.addTodo: {
    const savedTodo = {
        ...action.payload,
        isCompleted: action.payload.isCompleted ?? false,
    };
    return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
    };
    }

    case actions.revertTodo:
    case actions.updateTodo: {
    const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.payload.id ? action.payload : todo
    );

    const updatedState = {
        ...state,
        todoList: updatedTodos,
    };

    if (action.error) {
        updatedState.errorMessage = action.error.message;
    }

    return updatedState;
    }

    case actions.completeTodo: {
    const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.payload.id ? { ...todo, isCompleted: true } : todo
    );

    return {
        ...state,
        todoList: updatedTodos,
    };
    }

    case actions.setSortField:
    return {
        ...state,
        sortField: action.payload,
    };

    case actions.setSortDirection:
    return {
        ...state,
        sortDirection: action.payload,
    };

    case actions.setQueryString:
    return {
        ...state,
        queryString: action.payload,
    };

    default:
      return state;
  }
}

export { initialState, actions, reducer };

