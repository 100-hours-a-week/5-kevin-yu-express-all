import {config} from 'dotenv';
import express from 'express';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';

import memberRouter from './routes/userRouter.js';
import postRouter from './routes/postRouter.js';

config();

const app = express();
const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_PATH = path.join(__dirname, 'public');
const HTML_PATH = path.join(PUBLIC_PATH, 'html');

app.use(express.static(PUBLIC_PATH));
// request body에 담겨 오는 json 데이터 파싱
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// root로 접속하면 우선 로그인 페이지로
app.get('/', (req, res) => {
    res.redirect('/board');
});

// member.json을 쓰는 페이지는 전부 memberRouter로
app.use('/users', memberRouter);

// 게시판은 바로 파일만 전달
app.get('/board', (req, res) => {
    res.sendFile(path.join(HTML_PATH, 'board.html'))
});

// board.json을 쓰는 페이지는 전부 postRouter로
app.use('/posts', postRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
