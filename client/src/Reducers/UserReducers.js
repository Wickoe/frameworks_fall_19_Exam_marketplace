export function user(state = {username: undefined, token: undefined, user: {}}, action) {
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
            newState["userId"] = action["userId"];

            return newState;
        case "DISPLAY_USER":
            newState["user"] = action["user"];

            return newState;
        default:
            return {...state}
    }
}