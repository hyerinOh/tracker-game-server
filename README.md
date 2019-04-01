# 여기없대
# Introduction

**여기없대**는 **Facebook 로그인** 기능을 기반으로 **Mapbox**와 **geolocation**을 이용한 간단한 위치 맞추기 게임입니다. 
만약 정답이 사용자가 입력한 값 보다 큰 숫자일 경우 'UP' 팝업이, 작을 경우 'DOWN' 팝업이 띄워지게 되며, 주어진 시간 안에 답을 맞추지 못할 경우 'Time out' 팝업이 띄워지게 됩니다. 상대방이 정답을 맞췄다면 'OO(상대방 이름) found your location' 팝업이 띄워지며, 맞춘 사용자에게는 'You found' 팝업이 띄워지게 됩니다.

## Requirements
- Facebook 가입이 선행되어야 합니다.
- Chrome Browser를 권장합니다.

## Prerequisites
- Node.js 설치

## Installation

### Server
```
git clone https://github.com/hyerinOh/tracker-game-server.git
cd tracker-game-server
npm install
npm start
```
## Features
- Facebook을 이용한 로그인 구현
- geolocation을 이용하여 현재 위치(위도, 경도) 가져오기
- Mapbox를 이용하여 지도와 마커 생성 기능 구현
- Socket.io를 이용한 실시간 양방향 통신 구현
- Socket.io를 이용한 방 생성과 방 제거 기능 구현

## Server-side
- Node.js가 권장하는 ES2015
- 자바스크립트 엔진(V8 engine)기반의 서버사이드 플랫폼 Node.js
- Node.js 웹 어플리케이션 프레임워크 Express
- 실시간 양방향 소통을 위한 Socket.io 사용

## Deployment
### Server
- AWS Elastic Beanstalk

## Version control
- client, server의 독립적인 관리를 위한 GIT Repo 구분
- Branch, Pull Request 기반 개발 진행
