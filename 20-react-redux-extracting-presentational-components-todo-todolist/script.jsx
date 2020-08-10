const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }
            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }

};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(state, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t=> todo(t, action));
        default:
            return state;
    }
};

const visibilityFilter = (
    state = 'SHOW_ALL',
    action
) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

const {createStore, combineReducers} = Redux;

const todoApp = combineReducers({
    todos,
    visibilityFilter
});

const store = createStore(todoApp);

class FilterLink extends React.Component {
    
    constructor() {
        super()
        this.toggle = this.toggle.bind(this);
    }
    
    toggle(event) {
        const {filter} = this.props;
        event.preventDefault();
        store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter
        })
    }
    
    render() {
        const {children, currentFilter, filter} = this.props;
        if (filter === currentFilter) {
            return (
                <span>{children}</span>
            )
        }
        return (
            <a
                href="#"
                onClick={(e) => this.toggle(e)}
                >
                {children}
            </a>
        )
    }
}

class Todo extends React.Component {
    render() {
        const {id, text, onClick, completed} = this.props;
        return (
            <li key={id}
                onClick={() => onClick()}
                style={{textDecoration: completed ? 'line-through' : 'none'}}>
                {text}
            </li>
        )
    }
}

class TodoList extends React.Component {
    render() {
        const {todos, onTodoClick} = this.props;
        return (
            <ul>
                {todos.map((todo) => (
                    <Todo key={todo.id}
                          {...todo}
                          onClick={() => onTodoClick(todo)}
                    />
                ))}
            </ul>
        )
    }
}

const getVisibleTodos = (
    todos,
    filter
) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_ACTIVE':
            return todos.filter((todo) => !todo.completed);
        case 'SHOW_COMPLETED':
            return todos.filter((todo) => todo.completed);
    }
};

let nextTodoId = 0;
class TodoApp extends React.Component {
    
    constructor() {
        super();
        this.addTodo = this.addTodo.bind(this);
        this.toggleTodo = this.toggleTodo.bind(this);
    }
    
    addTodo() {
        store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
        });
        this.input.value = '';
    }
    
    toggleTodo(todo) {
        store.dispatch({
            type: 'TOGGLE_TODO',
            id: todo.id
        })
    }
    
    render() {
        const {todos, visibilityFilter} = this.props;
        const visibleTodos = getVisibleTodos(todos, visibilityFilter);
        return (
            <div>
                <input ref={(node) => this.input = node}/>
                <button onClick={this.addTodo}>Add Todo</button>
                <TodoList
                    todos={visibleTodos}
                    onTodoClick={this.toggleTodo}
                />
                <p>
                    Show:
                    {' '}
                    <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter}>All</FilterLink>
                    {' '}
                    <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter}>Active</FilterLink>
                    {' '}
                    <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter}>Completed</FilterLink>
                </p>
            </div>
        )
    }
}

const render = () => {
    ReactDOM.render(
        <TodoApp {...store.getState()}/>,
        document.getElementById('root')
    )
};

store.subscribe(render);
render();

// Function exported from deep-freeze lib
function deepFreeze (o) {
    if (o===Object(o)) {
        Object.isFrozen(o) || Object.freeze(o)
        Object.getOwnPropertyNames(o).forEach(function (prop) {
            prop==='constructor'||deepFreeze(o[prop])
        })
    }
    return o
}