import * as api from './api.js';


export const login = api.login;
export const register = api.register;
export const logout = api.logout;

const endpoints = {
    allGames: '/data/games?sortBy=_createdOn%20desc',
    byId: '/data/games/',
    create: '/data/games',
    edit: '/data/games/',
    delete: '/data/games/',
    home: '/data/games?sortBy=_createdOn%20desc&distinct=category',
    commentsById: (id) => `/data/comments?where=gameId%3D%22${id}%22`,
    addComment: '/data/comments'
    
}

export async function getThreeRecentGames() {
    return api.get(endpoints.home)
}

export async function getAllGames() {
    return api.get(endpoints.allGames);
}

export async function getGameById(id) {
    return api.get(endpoints.byId + id);
}

export async function createGame(data) {
    return api.post(endpoints.create, data);
}

export async function deleteGame(id) {
    return api.del(endpoints.delete + id);
}

export async  function editGame(id, data) {
    return api.edit(endpoints.edit + id, data);
}

export async function getCommentsByID(id) {
    return api.get(endpoints.commentsById(id));
}

export async function addComment(data) {
    return api.post(endpoints.addComment, data);
}



