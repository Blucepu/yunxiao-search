// 部署配置（可按需修改，无需重新构建）
//
// apiBase：实时数据代理地址。当前指向本机局域网服务（yunxiao-insight 的
// `bun run src/cli.ts serve`，默认端口 4173）。页面打开后自动探测该地址：
// 可达 → 「实时模式」，点「实时搜索」即同步云效；不可达 → 回退轮询同目录
// data.json，不会报错。
//
// 注意：
// · 本机 IP 变化（DHCP）后需改这里并重新上传 config.js；
// · 页面若以 https 打开（如 OSS 默认域名），浏览器会拦截 http 的 apiBase
//   （混合内容限制）——那种场景请把代理部署为 https，或留空走静态模式；
// · 切勿把云效 token 写进这里或任何前端文件。
window.__YUNXIAO_SEARCH__ = { apiBase: "http://192.168.40.21:4173" };
