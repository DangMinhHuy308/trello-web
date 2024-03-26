let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-y0pj.onrender.com'
}
// console.log('apiRoot',apiRoot);
export const API_ROOT = apiRoot
// export const API_ROOT = 'https://trello-api-y0pj.onrender.com'