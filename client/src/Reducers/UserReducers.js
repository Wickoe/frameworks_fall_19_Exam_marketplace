export function user(state = {username: undefined, token: undefined}, action) {
    const newState = {...state};

    switch (action["type"]) {
        case 'GET_USER':
            // TODO - missing implementation
            throw Error('Missing implementation!');
        case 'POST_USER':
            // TODO - missing implementation
            throw Error('Missing implementation!');
        case 'UPDATE_USER':
            newState["username"] = action["username"];
            newState["token"] = action["token"];
            newState["admin"] = action["admin"];

            return newState;
        default:
            return {...state}
    }
}