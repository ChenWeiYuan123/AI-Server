const fetch = require('node-fetch');
const axios = require('axios');
const token = 'pat_Eh9WUx92lrX8uukejbC9AXB4O768NPGfWJbhzJiNCoGfm4Ve7dw9ujTd8k3yoY0L';

// const express 
const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
};
const streamBot = async () => {
    const axiosStream = axios.create({
        baseURL: 'https://api.coze.cn/v3',
        headers,
    });
    //  请求chatGPT接口
    await axiosStream.post(`/chat`,
      {
        bot_id: "7381333948393685026",
        user_id: "test",
        additional_messages: [
            {
                role: "user",
                type: "question",
                content: `是一个新需求：深大南，南山地铁附近的房子，有满足要求的直接发我房源信息即可。要求如下
                1. 房租4000以内（房补前）
                2. 舍友不养猫不养狗
                3. 尽量不做饭`,
                content_type: "text"
            }
        ],
        stream: true
      },
      {
        responseType: 'stream' // 流式返回
      }
    ).then(response => {
      const chatResponseStream = response.data;
      let str = ''
      //  监听有数据返回，res.write一点一点写入返回给前端
      chatResponseStream.on('data', (chunk) => {
        const chunkRes = chunk.toString()
        const [eventStr, dataStr] = chunkRes.split('\n');
        if(eventStr.includes('created') || eventStr.includes('in_progress')  || eventStr.includes('completed') ) {
            console.log(eventStr);
            console.log(dataStr);
        } else {
            const dataJson = dataStr.slice('5');
            const data = JSON.parse(dataJson);
            const {content} = data;
            str += content;
            console.log(eventStr);
            console.log(str);
        }
        // str += chunkRes
        // res.write(chunkRes)
      });
      //  监听数据返回完成，关闭
      chatResponseStream.on('end', () => {
        console.log('end==========');
      })
    }).catch(e => {
        console.log(e);
    //   res.end()
    })

}
const fetchBot = async () => {
    const res = await fetch('https://api.coze.cn/v3/chat', {
        method: "post",
        headers,
        body: JSON.stringify({
            bot_id: "7381333948393685026",
            user_id: "test",
            stream: false,
            additional_messages: [
                {
                    role: "user",
                    type: "question",
                    content: `是一个新需求：深大南，南山地铁附近的房子，有满足要求的直接发我房源信息即可。要求如下
                    1. 房租4000以内（房补前）
                    2. 舍友不养猫不养狗
                    3. 尽量不做饭`,
                    content_type: "text"
                }
            ]
        })
    });
    const json = await res.json();
    console.log('res: ', json)
}
const main = async () => {
    await streamBot();
}
main();