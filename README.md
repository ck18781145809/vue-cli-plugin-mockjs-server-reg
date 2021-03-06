## NEW

vue-cli-plugin-mockjs-server-reg is modified based on [vue-cli-plugin-mockjs-server](https://www.npmjs.com/package/vue-cli-plugin-mockjs-server),added support for regular expression path.

```json
/**
 *  Get user @url /\/user\/\d+/
 *  /user/12
 */
{
  "code": 0,
  "result": {
    "id|+1": 1,
    "name": "@name",
    "email": "@email"
  }
}
```

## INSTALL

```bash
vue add mockjs-server-reg
```

## CONFIG

Modify `vue.config.js`:

```javascript
pluginOptions: {
    mockjs: {
        path: path.join(__dirname, './mock'),
        debug: true,
        port: 3000
    }
}
```

## MOCK FILE

- create `json` file in `mock` folder 
- create `js` file in `mock` folder

```json
/**
 *  Show favourite user @url /user/love
 */
{
    "code": 0,
    "result|5": [
      {
        "id|+1": 1,
        "name": "@name",
        "email": "@email"
      }
    ]
  }
```

```js
/**
 * User Login @url /user/login
 */
module.exports = () => {
    return {
        code: '200',
        data: {
            userName: '@cname()',
            // Token值
            tokenValue: '@guid()',
        }
```

## PREVIEW
- Visit [http://localhost:3000](http://localhost:3000) to see the mock dashboard
- Visit [http://localhost:3000/user/love](http://localhost:3000/user/love)  to see the mocked JSON result
- Visit [http://localhost:3000/user/login](http://localhost:3000/user/login) to see the mocked JSON result
- Visit [http://localhost:3000/user/12](http://localhost:3000/user/12) to see the mocked JSON result


## ACKNOWLEDGEMENT

Most of the codes are from [@soon08](https://github.com/soon08/mockjs-webpack-plugin).