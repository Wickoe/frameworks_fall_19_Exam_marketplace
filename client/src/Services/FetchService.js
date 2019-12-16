import AuthenticationService from "./AuthenticationService";

export default class FetchService {
    async fetch(path, pathArgument = "", method = 'GET', payload) {
        const headers = {"Content-type": "application/json; charset=UTF-8"};

        const webResponse = await fetch(`${path}/${pathArgument}`, {
            method: method,
            body: JSON.stringify(payload),
            headers: headers
        });

        const webResponseStatus = webResponse["status"];

        const data = await webResponse.json();

        const error = (webResponseStatus !== 200 || webResponseStatus !== 304 || data["error"]) ? 0: 1;

        return {msg: data["msg"], error: error, data: data["token"]};
    }

    async postUser(userCredentials) {
        const postUserApi = (process.env.REACT_POST_USER_API || 'http://localhost:8080/api/users');

        return await this.fetch(postUserApi, "", 'POST', userCredentials);
    }

    async authenticateUser(userCredentials) {
        const authenticateUserApi = (process.env.REACT_AUTHENTICATE_USER_API || 'http://localhost:8080/api/users/authenticate');

        return await this.fetch(authenticateUserApi, "", 'POST', userCredentials);
    }
}