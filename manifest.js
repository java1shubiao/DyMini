const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, `./.env.${process.env.NODE_ENV}`) })
const ENV = process.env
const appId = 'VITE_APP_MP_APP_ID';
const platForm = 'VITE_APP_PLATFORM';
// 环境修改 appid
const realAppid = ENV[`${appId}`];
const realPlatForm = ENV[`${platForm}`]
const key = 'appid';
// manifest.json 路径
// eslint-disable-next-line node/no-path-concat
const manifestFileUrl = `${__dirname}/src/manifest.json`;
// 读取文件数据
let manifestFileData = fs.readFileSync(manifestFileUrl, { encoding: 'utf8' });
// 移除注释
manifestFileData = manifestFileData.replace(/\/\*[\s\S]*?\*\//g, '');
// 将txt转成obj
const manifestFileDataObj = JSON.parse(manifestFileData);
// 修改指定key对应的value
manifestFileDataObj[`mp-${realPlatForm}`][`${key}`] = realAppid;
// 写入文件
fs.writeFileSync(manifestFileUrl, JSON.stringify(manifestFileDataObj), { encoding: 'utf8' });
