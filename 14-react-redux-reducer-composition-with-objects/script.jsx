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


const todoApp = (state = {}, action) => {
    return {
        todos: todos(
            state.todo,
            action
        ),
        visibilityFilter: visibilityFilter(
            state.visibilityFilter,
            action
        )
    }
};

const {createStore} = Redux;
const store = createStore(todoApp);

console.log('Initial State:');
console.log(store.getState());
console.log('--------------');

store.dispatch({
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
});

console.log('Dispatch Action:');
console.log(store.getState());
console.log('--------------');

store.dispatch({
    type: 'ADD_TODO',
    id: 1,
    text: 'Go Shopping',
});

console.log('Dispatch Action:');
console.log(store.getState());
console.log('--------------');

store.dispatch({
    type: 'TOGGLE_TODO',
    id: 1
});

console.log('Dispatch Action:');
console.log(store.getState());
console.log('--------------');

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