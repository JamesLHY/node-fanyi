import * as https from "https";
import * as queryString from "querystring";
import md5 = require("md5");
import {appId, key} from "./privite";


export const translate = (word:string) => {

    const salt = Math.random()
    const sign = md5(appId + word + salt + key);
    let from, to
    if (/[a-zA-Z]/.test(word[0])) {
        from = 'en'
        to = 'zh'
    } else {
        from = 'zh'
        to = 'en'
    }
    const query = queryString.stringify({
        from, to, salt,sign,
        q: word,
        appid: appId,
    })
    const options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query,
        method: 'GET'
    };

    const request = https.request(options, (response) => {
        let chunks:Buffer[]= [];
        response.on('data', (chunk) => {
            chunks.push(chunk)
        });
        response.on('end', () => {
            const string = Buffer.concat(chunks).toString()

            type BaiduResult = {
                error_code?: string
                error_msg?: string
                from: string
                to: string
                trans_result: {
                    src: string,
                    dst: string
                }[]
            }
            const object: BaiduResult = JSON.parse(string)
            if (object.error_code) {
                console.error(object.error_msg)
                process.exit(2)
            }
            console.log(object.trans_result[0].dst);
            process.exit(0)
        })
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
}


