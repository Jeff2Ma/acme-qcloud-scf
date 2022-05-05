module.exports = {
    email: 'test@example.com',  // 你的邮箱
    domain: 'example.com', // 需要生成证书的根域名，最终生成通配符证书
    qcloudSecretId: '', // 腾讯云 SecretId, https://console.cloud.tencent.com/cam/capi
    qcloudSecretKey: '', // 腾讯云 SecretKey
    dnspodServer: 'dnspod.cn', // 国内版用 dnspod.cn（默认），国际版用 dnspod.com
    dnspodToken: 'xxxx,xxxxxxxxxxxxxxxxxxxx', // 在 https://console.dnspod.cn/account/token/token 生成，合在一块用, 隔开
    cdnDomainList: [ // 加速域名配置
        'cdn.example.com'
    ],
    wecomWebHook: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=XXXXXXXXXXXXXXXXXXX', // 企业微信机器人通知 webhook
}
