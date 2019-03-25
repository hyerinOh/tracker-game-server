const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const server = require('http').createServer(app);
// http server를 socket.io server 로 upgragde

app.get('/game', (req, res) => {
  res.send({ message: ok});
});


// 웹 소켓 서버 실행
const socketio = require('socket.io');
const io = socketio.listen(server);
let count = 0;
server.listen(3001);
const allClients = [];
const userInfo = {};
io.on('connection', (socket) => {
  // console.log('사용자 접속', socket.client.id);
  socket.on('userName', (userNameAndPhto) => {
    userInfo.name = userNameAndPhto.name;
    userInfo.photo = userNameAndPhto.photo;
    userInfo.id = socket.client.id;
    console.log('userInfo',userInfo)
    const copiedUserInfo = JSON.parse(JSON.stringify(userInfo));
    if (allClients.length <= 2) {
      count++;
      allClients.push(copiedUserInfo);
      io.emit('all', allClients);
      socket.emit('order', count);
    }
    // console.log('all', allClients);
  });
  
  socket.on('location', (location) => {
    console.log(location);
    console.log(allClients);
    const forP1  = {};
    const forP2 = {};

    forP2.name = allClients[0].name;
    forP2.id = allClients[0].id;
    forP2.latitude = 37.491875;
    forP2.longitude = 126.983863;
    // forP2.latitude = location.latitude;
    // forP2.longitude = location.longitude;

    if (allClients.length === 2) {
      forP1.name = allClients[1].name;
      forP1.id = allClients[1].id;
      forP1.latitude = 37.184631;
      forP1.longitude = 127.121022;
      
      // forP1.latitude = location.latitude;
      // forP1.longitude = location.longitude;
    }

    if (Object.keys(forP1).length) {
      io.to(forP2.id).emit('quiz', forP1);
      io.to(forP1.id).emit('quiz', forP2);
    }
    
  })

  socket.on('winner', (winner) => {
    io.emit('who', winner)
  })

   socket.on('disconnect', (reason) => {
      if (reason === 'transport close') {
        count--;
        console.log('Got disconnect!');
        console.log('count', count)
        const i = allClients.indexOf(socket.client.id);
        allClients.splice(i, 1);
      }
      console.log(socket.client.id, '<<< 여기여기');
      console.log(allClients)
   });
});

// ip : 192.168.0.53
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
