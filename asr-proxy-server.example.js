/* ============================================================
 * 后端语音识别中转服务（示例 · Node.js）
 * ------------------------------------------------------------
 * 作用：浏览器不能直接调用讯飞/百度/腾讯等国内 ASR（需要签名、密钥
 *       不能暴露在前端），所以由一个轻量后端来“中转”：
 *       前端录音 -> POST 音频到本服务 -> 服务调用国内 ASR -> 返回文字。
 *
 * 前端配合：js/voice.js 里调用 Voice.setProvider('proxy', 'https://你的域名/asr')
 *
 * 部署步骤：
 *   1) npm init -y && npm install express
 *      （百度/讯飞 SDK 按需安装，如 baidu-aip-sdk / 讯飞 websocket 自行实现）
 *   2) 把下面的 APIKey/Secret 填上（或读环境变量）
 *   3) node asr-proxy-server.example.js
 *   4) 用 https 反向代理（如 Nginx / Caddy）暴露 /asr，并把地址配到前端
 *
 * 注意：浏览器录音（getUserMedia）要求页面在 https 或 localhost 下，
 *       所以上线务必用 https 域名。
 * ============================================================ */

const express = require('express');
const http = require('http');

const app = express();
app.use(express.raw({ type: () => true, limit: '10mb' })); // 接收原始音频

/* ============ 在这里填入你的国内 ASR 凭据 ============ */
const ASR = {
  provider: process.env.ASR_PROVIDER || 'baidu', // 'baidu' | 'xfyun' | 'tencent'
  // 百度语音识别（需安装 baidu-aip-sdk）
  baidu: { appId: '', apiKey: '', secretKey: '' },
  // 讯飞开放平台（websocket 流式，需自行实现签名与连接）
  xfyun: { appId: '', apiKey: '', apiSecret: '' },
  // 腾讯云一句话识别（需安装 tencentcloud-sdk-nodejs）
  tencent: { secretId: '', secretKey: '' }
};
/* ======================================================= */

// 把二进制音频转成对应 ASR 需要的格式并调用，返回识别文字
// 这里只给出“接线骨架”，具体三家 SDK 调用请按官方文档补全。
async function callASR(audioBuffer, lang) {
  // 示例（伪代码，需替换为真实 SDK 调用）：
  // if (ASR.provider === 'baidu') {
  //   const client = new AipSpeech(ASR.baidu.appId, ASR.baidu.apiKey, ASR.baidu.secretKey);
  //   const res = await client.recognize(audioBuffer.toString('base64'), 'wav', 16000, { dev_pid: 1537 });
  //   return res.result ? res.result[0] : '';
  // }
  // if (ASR.provider === 'xfyun') { /* websocket 流式识别 */ }
  // if (ASR.provider === 'tencent') { /* 一句话识别 */ }
  console.warn('[asr] 尚未接入真实 ASR，返回占位文本。请按 asr-proxy-server.example.js 注释补全。');
  return '示例识别文本'; // TODO: 替换为真实识别结果
}

app.post('/asr', async (req, res) => {
  try {
    const lang = (req.headers['x-lang'] || 'zh-CN').toString();
    const audioBuffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from([]);
    if (!audioBuffer.length) return res.json({ error: 'empty-audio' });
    const text = await callASR(audioBuffer, lang);
    res.json({ text: text || '' });
  } catch (e) {
    res.json({ error: String(e && e.message || e) });
  }
});

const PORT = process.env.PORT || 3001;
http.createServer(app).listen(PORT, () => {
  console.log('ASR proxy listening on http://localhost:' + PORT + '  (provider=' + ASR.provider + ')');
});
