const addCounter = (list) => {
    return [...list, 0];
};

const testAddCounter = () => {
    const listBefore = [];
    const listAfter = [0];
    
    deepFreeze(listBefore);
    
    expect(
        addCounter(listBefore)
    ).toEqual(listAfter)
    
};

testAddCounter();

console.log('All tests passed!!')


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