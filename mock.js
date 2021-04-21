/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')

const { walk } = require('./util')

// 匹配 @url 字段
const RE = /^\s*\/\*[*\s]+?([^\r\n]+)[\s\S]+?@url\s+([^\n]+)[\s\S]+?\*\//im

// 这一步主要是遍历所有 /mock 文件夹下面的文件，将定义的所有接口提取到一个变量中，然后返回
function parseAPIs (dir) {
    // 之前使用 Object 作为载体，现在使用 Map，可以直接使用 RegExp 作为 key
    const routes = new Map()
    // 存放 String 类型 url
    routes.set('string', new Map())
    // 存放 RegExp 类型 url
    routes.set('regexp', new Map())

    const files = walk(dir);

    (files || []).forEach(filepath => {
        const content = String(fs.readFileSync(filepath, 'utf8')).trim() || '{}'

        let url = filepath
        let describe = 'no description'

        const m = content.match(RE)

        if (m) {
            url = m[2].trim()
            describe = m[1].replace(/(^[\s*]+|[\s*]+$)/g, '')
        }

        // 判断 .json 文件
        const isJsonFile = /\.json$/.test(filepath);
        // 判断 @url 写法是否是正则，确保 / 开头，/ 结尾，不支持 Regexp options
        const isRegUrl = /^\/(\S+)\/$/.test(url)

        if (!isRegUrl) {
            if (url[0] !== '/') {
                // fix url path
                url = '/' + url
            }
    
            let pathname = url
            if (pathname.indexOf('?') > -1) {
                pathname = pathname.split('?')[0]
            }
    
            if (routes.get('string').has(pathname)) {
                console.warn('[Mock Warn]: [' + filepath + ': ' + pathname + '] already exists and has been covered with new data.')
            }

            routes.get('string').set(
                url,
                {
                    url: url,
                    filepath: filepath,
                    describe: describe,
                    content: isJsonFile ? content : null
                }
            )
        } else {
            let regUrlSource = url.match(/^\/(\S+)\/$/)[1]

            // 如果不是以 / 或者 \/ 开头
            if (regUrlSource.match(/^[^\/|^\\\/]\S+/gm)) {
                regUrlSource = '\\/' + regUrlSource
                console.log(regUrlSource);
            }

            if (
                regUrlSource.match(/[^\\]+(?=\/)/gm) || // 未转义 /
                regUrlSource.match(/^\//gm) || // 未转义开头 / 
                regUrlSource.match(/\S+\/$/gm) //  以 / 结尾
            ) {
                console.warn('[Mock Warn]: [' + filepath + '] Regular expression error!')
            }

            const regUrl = new RegExp(regUrlSource)

            routes.get('regexp').set(
                regUrl,
                {
                    url: regUrl,
                    filepath: filepath,
                    describe: describe,
                    content: isJsonFile ? content : null
                }
            )
        }
    })

    return routes
}

function cahrToUnicode (string) {
    return string.split('').forEach(char => {
        char = `${char.codePointAt(0)}`
    });
}

module.exports = parseAPIs
