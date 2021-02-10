import HttpRequest from './HttpRequest'

const http = new HttpRequest();
http.autoSetTokenHeader();

export const homeFeed = async () => {
    return await http.get('/api/backend/post/home-feed')
}