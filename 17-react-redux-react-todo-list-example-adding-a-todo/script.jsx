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

let nextTodoId = 0;
class TodoApp extends React.Component {
    
    constructor() {
        super()
        this.addTodo = this.addTodo.bind(this);
    }
    addTodo() {
        store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
        });
        this.input.value = '';
    }
    render() {
        return (
            <div>
                <input ref={(node) => this.input = node}/>
                <button onClick={this.addTodo}>Add Todo</button>
                <ul>
                    {this.props.todos.map((todo) => (
                        <li key={todo.id}>
                            {todo.text}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

const render = () => {
    ReactDOM.render(
        <TodoApp todos={store.getState().todos}/>,
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