// const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const socketio = require('socket.io');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const server = require('http').createServer(app);

app.get('/game', (req, res) => {
  res.send({ message: ok });
});

const io = socketio.listen(server);
server.listen(3001);
const userInfo = {};
const rooms = {};
let roomIndex = 0;
let roomId;

io.on('connection', (socket) => {

  // 방 만들기
  socket.on('requestRoom', (userNameAndPhto) => {
    // 방에 한 명이라도 있을 때
    for (roomId in rooms) {
      if (rooms[roomId].userId.length === 1) {
        socket.join(roomId);
        rooms[roomId].userId.push(socket.client.id);
        userInfo[socket.client.id] = {
          ...userNameAndPhto,
          id: socket.client.id,
          roomId: roomId
        }

        io.sockets.in(roomId).emit('completeMatch', 'game match');
        io.to(rooms[roomId].userId[0]).emit('target', userInfo[rooms[roomId].userId[1]]);
        io.to(rooms[roomId].userId[1]).emit('target', userInfo[rooms[roomId].userId[0]]);
        return;
      }
    }

    // 방 없을 때
    socket.join(`room${++roomIndex}`);

    rooms[`room${roomIndex}`] = {
      userId: [socket.client.id],
    };

    userInfo[socket.client.id] = {
      ...userNameAndPhto,
      id: socket.client.id,
      roomId: `room${roomIndex}`,
    };
  });

  socket.on('removeRoom', (currRoomId) => {
    if (rooms[currRoomId]) {
      socket.leave(currRoomId);
      delete rooms[currRoomId];
    }
  });


  // socket.on('location', (location) => {
  //   console.log(location);
  //   console.log(allClients);
  //   const forP1  = {};
  //   const forP2 = {};

  //   forP2.name = allClients[0].name;
  //   forP2.id = allClients[0].id;
  //   // 임시값
  //   forP2.latitude = 37.491875;
  //   forP2.longitude = 126.983863;

  //   // 실제 사용 코드
  //   // forP2.latitude = location.latitude;
  //   // forP2.longitude = location.longitude;

  //   if (allClients.length === 2) {
  //     forP1.name = allClients[1].name;
  //     forP1.id = allClients[1].id;

  //     //임시값
  //     forP1.latitude = 37.184631;
  //     forP1.longitude = 127.121022;
      
  //     // 실제 사용 코드
  //     // forP1.latitude = location.latitude;
  //     // forP1.longitude = location.longitude;
  //   }

  //   if (Object.keys(forP1).length) {
  //     io.to(forP2.id).emit('quiz', forP1);
  //     io.to(forP1.id).emit('quiz', forP2);
  //   }
  // })

  socket.on('winner', (winner) => {
    io.emit('who', winner);
  });

  socket.on('disconnect', (reason) => {
    // 브라우저 껐을 때
    if (reason === 'transport close') {
      console.log('Got disconnect!');
      // const i = allClients.indexOf(socket.client.id);
      // allClients.splice(i, 1);
    }
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
