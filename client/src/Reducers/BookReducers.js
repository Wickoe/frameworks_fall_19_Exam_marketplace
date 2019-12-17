export function books(state = [], action) {
    const newState = [...state];

    switch (action["type"]) {
        case 'UPDATE_BOOKS':
            return newState;
        default:
            return newState;
    }
}