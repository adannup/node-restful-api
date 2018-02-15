const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3002;

const server = http.Server(app);

server.listen(PORT, () => console.log(`Server up on port ${PORT}`));
