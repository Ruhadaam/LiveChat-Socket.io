const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const router = require('./routes/route');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Express ayarları
app.set("view engine", "ejs");

// Middleware'ler
app.use(express.static('public')); // '/static' route'u yerine her şeyi 'public' klasöründen servis eder
app.use('/css', express.static(path.join(__dirname, 'assets', 'css')));
app.use('/js', express.static(path.join(__dirname, 'assets', 'js')));
app.use('/img', express.static(path.join(__dirname, 'assets', 'img')));

// Router
app.use(router);

// Socket.io bağlantısı
io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı');

    socket.on('disconnect', () => {
        console.log('Bir kullanıcı ayrıldı');
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        // Gelen mesajı diğer tüm kullanıcılara göndermek için broadcast kullanabilirsiniz
        // socket.broadcast.emit('chat message', msg);
    });
});

// Sunucu dinleme
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server ${PORT} numaralı portta çalışıyor`);
});
