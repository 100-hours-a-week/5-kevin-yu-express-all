const fs = require('fs');
const path = require('path');

// 날짜 관련 유틸 함수
const timeUtils = require('../utils/dataUtils.js');

const JSON_FILE = path.join(__dirname, "..", 'json/board.json');

const getBoardJson = async () => {
    const file = await fs.promises.readFile(JSON_FILE, 'utf8');
    return JSON.parse(file);
};

const getBoard = async () => {
    return getBoardJson()
        .then(json => json.posts);
};

const getSequence = async () => {
    return getBoardJson()
        .then(json => json.sequence);
};

let board; // getPostByNo에서 찾은 board를 다른 함수에서도 사용하기 위해
const getPostByNo = async (postNo) => {
    board = await getBoard();
    return board.find(post => post.no === postNo);
};

const increaseHit = async (postNo) => {
    const post = await getPostByNo(postNo);
    post.hit += 1;
    await fs.promises.writeFile(JSON_FILE, JSON.stringify({sequence: await getSequence(), posts: board}, null, 2));
};

const updateCommentCount = async (postNo, commentCount) => {
    const post = await getPostByNo(postNo);

    console.log(commentCount);

    post.comment = commentCount;
    await fs.promises.writeFile(JSON_FILE, JSON.stringify({sequence: await getSequence(), posts: board}, null, 2));
};

const addPost = async (userInput, imageName, nickname) => {
    const board = await getBoard();
    const sequence = await getSequence();

    const newPost = {
        no: sequence,
        title: userInput.title,
        content: userInput.content,
        image: imageName,
        writer: nickname,
        regDt: timeUtils.getCurrentTime(),
        like: 0,
        comment: 0,
        hit: 0,
    };
    board.unshift(newPost);

    await fs.promises.writeFile(JSON_FILE, JSON.stringify({sequence: sequence + 1, posts: board}, null, 2));
    return sequence;
};

const editPost = async (postNo, userInput) => {
    const post = await getPostByNo(postNo);

    const prevImage = post.image;

    post.title = userInput.title;
    post.content = userInput.content;
    post.image = userInput.image;
    post.regDt = timeUtils.getCurrentTime();

    const json = JSON.stringify({sequence: await getSequence(), posts: board}, null, 2);
    await fs.promises.writeFile(JSON_FILE, json);

    return prevImage; // 이전 이미지를 삭제하기 위해 이미지명 반환
};

const deletePost = async (postNo) => {
    const board = await getBoard();

    const index = board.findIndex(post => post.no === postNo);
    const prevImage = board[index].image;
    if (index !== -1) {
        board.splice(index, 1);
    } else {
        throw new Error('게시글 정보를 찾을 수 없습니다.');
    }

    await fs.promises.writeFile(JSON_FILE, JSON.stringify({sequence: await getSequence(), posts: board}, null, 2));
    return prevImage;
};

const changeNickname = async (prevNickname, newNickname) => {
    const board = await getBoard();
    board.forEach(post => {
        if (post.writer === prevNickname) {
            post.writer = newNickname;
        }
    });

    await fs.promises.writeFile(JSON_FILE, JSON.stringify({sequence: await getSequence(), posts: board}, null, 2));
};

module.exports = {
    getBoard,
    getPostByNo,
    increaseHit,
    updateCommentCount,
    addPost,
    editPost,
    deletePost,
    changeNickname,
};