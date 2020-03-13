npm --prefix ./server install ./server
npm install -g http-server
start-job -scriptblock {
cd server
node server.js
}
http-server ./web-page/build/ -o -p 3000

