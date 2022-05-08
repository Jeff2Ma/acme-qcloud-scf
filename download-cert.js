/**
 *
 * acme-qcloud-scf
 * @author Jeff2Ma
 * @url https://github.com/Jeff2Ma/acme-qcloud-scf
 */

const tencentcloud = require("tencentcloud-sdk-nodejs")
const base64Client = require('file-base64');
const path = require('path');
const extract = require('extract-zip')
const {exec} = require("child_process");

const afterDoneShellScript = `lnmp nginx restart`

// 读取配置文件
let config = {};
try {
    config = require('./config.custom.js')
} catch (e) {
    config = require('./config.example.js')
}

const outputDir = path.resolve(process.cwd(), 'dist', config.domain)
const outputPath = path.resolve(outputDir, '../', `${config.domain}.zip`)

async function base642zipPromise(Content) {
    return new Promise((resolve, reject) => {
        base64Client.decode(Content, outputPath, function (err, output) {
            console.log(err, output);
            if (err) reject(err);
            if (output) resolve(output);
        });
    });
}


(async () => {
    const sslClient = new tencentcloud.ssl.v20191205.Client({
        credential: {
            secretId: config.qcloudSecretId,
            secretKey: config.qcloudSecretKey,
        },
        // region: "ap-shanghai",
        profile: {
            signMethod: "TC3-HMAC-SHA256",
            httpProfile: {
                reqMethod: "POST",
                reqTimeout: 30,
                endpoint: "ssl.tencentcloudapi.com",
            },
        },
    })

    const {Certificates} = await sslClient.DescribeCertificates({})
    const target = Certificates.find(item => item.Alias === config.domain);
    if (!target) {
        console.log('没有找到目标 Certificate')
        return {};
    }
    const {Content} = await sslClient.DownloadCertificate({
        CertificateId: target.CertificateId,
    })

    if (Content) {
        try {
            await base642zipPromise(Content)
            await extract(outputPath, {dir: outputDir})
            console.log('Extraction complete');
            exec(afterDoneShellScript, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        } catch (err) {
            // handle any errors
            console.log(err)
        }
    }
    return {Content}
})();
