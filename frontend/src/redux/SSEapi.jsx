import axios from 'axios'

const SSEapi = axios.create({
    baseURL: "http://3.36.125.122:8082/sse/connect",
    headers: {
        "accept": "text/event-stream"
    },
})

export default SSEapi;

// 로그인 하면 connect
// 새로 들어온 머신 이름을 받고
// 오는 데이터 string 데이터 읽어서 내가 저장한 데이터에 이름이 같은지 확인
// 같으면 api를 다시 쏴.
// 최신 값 들어오면 구조가 바뀔거다
// 아니면 날리면 됨.

// 로그인 하면 event 하나 더 만들어서 connect를 받아.
// 그래야 또 안 보냄.
