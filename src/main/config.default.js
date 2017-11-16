const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const port = parseInt(process.env.PORT, 10) || 3000;
const indexPath = path.resolve(__dirname, 'build');
const indexPage = isDev ? `http://localhost:${port}` : `file://${indexPath}/index.html`;

module.exports = {
    isDev,
    indexPage
};