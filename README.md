# ExpressJS and TypeScript

## Installation

```
npm i typescript -g
npm i ts-node -g
```

```
git clone https://github.com/naphattharawat/ssl-monitor-api ssl-monitor-api
cd ssl-monitor-api
npm i
```

## Running

```
cp .env.example.txt config
npm start
```

open browser and go to http://localhost:3000

## PM2

```
pm2 start --interpreter ts-node src/bin/www.ts MyServerName
```
