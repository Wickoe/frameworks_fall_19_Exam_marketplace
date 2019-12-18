export function books(state = {books: [], categoryBooks: [], book: {}}, action) {
    const newState = {...state};

    switch (action["type"]) {
        case 'UPDATE_BOOK':
            newState["book"] = action["book"];

            return newState;
        case 'UPDATE_BOOKS':
            action["books"].forEach(function (book) {
                let found = false;
                let index = 0;

                while (!found && index < newState["books"].length) {
                    const containedBook = newState["books"][index];

                    found = containedBook["title"] === book["title"] &&
                        containedBook["author"] === book["author"] &&
                        containedBook["category"] === book["category"] &&
                        containedBook["price"] === book["price"];

                    index++;
                }

                if (!found) {
                    newState["books"].push(book);
                }
            });

            return newState;
        case 'UPDATE_CATEGORY_BOOKS':
            newState["categoryBooks"] = action["books"];

            return newState;
        default:
            return newState;
    }
}