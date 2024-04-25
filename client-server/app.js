import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

import memberRouter from './routes/memberRouter.js';
import boardRouter from './routes/boardRouter.js';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PUBLIC_PATH = path.join(__dirname, "public");

app.use(express.static(PUBLIC_PATH));
// request body에 담겨 오는 json 데이터 파싱
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// root로 접속하면 우선 로그인 페이지로
app.get('/', (req, res) => {
    res.redirect('/member/login');
});

// member.json을 쓰는 페이지는 전부 memberRouter로
app.use('/member', memberRouter);
app.use('/board', boardRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
