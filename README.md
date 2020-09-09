# MongoDB


## 1. 安裝、啟動和關閉方式

到官網去安裝 `mongoDB` 

然後在電腦的根目錄中新建一個 `data` 目錄 

在 `data` 目錄下新建一個 `db` 目錄 用來存放數據庫

因為 `/data/db` 是 `mongoDB` 默認的數據庫存儲位置

建立完成後開啟一個終端機 輸入 `mongod` 命令 然後不要關視窗 直接縮小

再另外開啟一個終端機輸入 `mongo` 命令 即可連上 `mongodb` 數據庫

* 若要關閉 `mongod` 的服務 按下 `control+C` 或直接關閉終端機即可

* 若要離開 `mongo` 連接的數據庫服務器 則輸入 `exit` 命令即可


## 2. 基本操作命令

在 `mongo` 中輸入 `show dbs` 可以查看所有數據庫

* 系統中本身會有 `admin` `config` `local` 三個數據庫 這三個數據庫不要動

在 `mongo` 中輸入 `use空格數據庫名稱` 會自動切換到該數據庫 

* 如果此數據庫不存在 則會創建

在 `mongo` 中輸入 `db` 則會顯示當前操作的數據庫 

假設你沒有通過 `use空格數據庫名稱` 切換數據庫 則默認會建立一個 `test` 數據庫

* 假設你現在 `use abc` 則原本 `db` 顯示的 `test` 會變成 `abc`

這時候可以通過 `show collections` 查看當前操作的數據庫中所有集合

然後通過 `db.集合名稱.find()` 則可找出該集合下的所有數據內容


## 3. 在 `mongo` 服務中建立一條數據

在 `mongo` 中輸入 `db.user.insertOne({"name":"John"})`

此命令會在當前操作的數據庫中創建一個集合叫 `user` 並在此集合中添加一條數據 `{"name":"John"}` 並給其添加 `id`

* 此 `id` 是自動生成且獨一無二的


## 4. 通過 `node.js` 連接並操作 `mongoDB` 數據庫（ demo1.js ）

`mongoDB` 的官方有提供一個 `mongodb` 模塊 但是操作上比較麻煩

所以民間又以官方提供的模塊為基礎 重新封裝了一個第三方模塊 `mongoose`

* `mongoose` 官方網站： http://mongoosejs.com/

這裏我們以學習 `mongoose` 為例做介紹 先創建一個 `mongoose-demo` 目錄

到目錄中創建 `demo1.js` 文件 然後 `npm init -y` 生成 `package.json`

這裏直接拿官網範例過來貼上, 下面逐步講解：

  - 使用 `npm i mongoose` 安裝 `mongoose` 模塊

  - 打開 `demo1.js` 加載 `mongoose` 到文件

  - 使用 `mongoose.connect` 連結 `mongoDB` 數據庫

    * 下一句的 `mongoose.Promise` 後面講到 `Promise` 再解釋

  - 創建一個變量 `Cat` 使用 `mongoose.model({name:type})` 方法創建數據庫模型

    * `Cat` 經過處理後會變成 `cats` (自動轉小寫複數)

  - 創建一個變量 `kitty` 使用 `new Cat({name:value})` 方法添加數據

  - 通過 `kitty.save()` 方法傳入回調函數驗證建立數據錯誤與否

代碼如下：

```js

var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.Promise = global.Promise

var Cat = mongoose.model('Cat', { name: String })

var kitty = new Cat({ name: 'Zildjian' })

kitty.save(function(err){
    if(err){
        console.log('err.')
    }else{
        console.log('meow~')
    }
})

```


## 5. 自己手寫一個 `node.js` 連接數據庫並感知增刪改查（ demo2.js ）

引入 `mongoose` 模塊

使用 `mongoose.connent()` 方法連結 `mongoDB` 參數直接填入 `mongodb://localhost/數據庫名稱`

* 參數連結的數據庫如果不存在會自動創建

創建一個變量 `Schema` 為 `mongoose.Schema` 這裏用來獲取數據庫的結構對象

創建一個變量 `userSchema` 為 `new Schema({})` 這裏在設置集合的結構

* `Schema` 中除了設置 `type` 類型 還可設置很多屬性 常用的比如有 `required`

* `required` 設為 `true` 則表示該內容為必填項目

創建一個變量 `User` 為 `mongoose.model('User', userSchema)` 這裏在設計集合的模型

* 這邊集合名統一設置為大寫名詞單數 `mongoDB` 會自動創建成小寫複數的集合

代碼如下：

```js

var mongoose = require('mongoose')

var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/users')

var userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
})

var User = mongoose.model('User', userSchema)

```


### 5-1. 新增數據

創建一個變量 `john` 為 `new User({})` 裡面填入數據內容 即可新增數據

使用 `john.save()` 方法裡面傳入回調函數 參數1 為 `err` 錯誤對象 參數2 為 `ret` 數據內容

開啟 `node` 執行後 如果存儲成功 回傳： 保存成功數據為 `ret`

代碼如下：

```js

var john = new User({ username: "John", password: "123456", email: "john@kimo.com" })

john.save(function (err, ret) {
    if (err) {
        console.log(err)
    } else {
        console.log('保存成功，數據為：' + ret)
    }
})

// 在終端機上使用 `node demo2.js` 開啟 得到結果為：

`
保存成功，數據為：{
  _id: 5f56364b347a37069f9e44e3,
  username: 'John',
  password: '123456',
  email: 'john@kimo.com',
  __v: 0
}
`

```


### 5-2. 使用 `find()` 方法查詢數據

使用 find() 方法查詢的結果不管有幾條數據都會呈現數組

* 查詢所有數據：

  使用 `User.find()` 方法裡面傳入回調函數 參數1 為 `err` 錯誤對象 參數2 為 `ret` 數據內容

  開啟 `node` 執行後 如果存儲成功 回傳： `ret` 

  + 此 `ret` 即為 `users` 這個集合中的所有數據 是一個數組

  代碼如下：

  ```js

  User.find(function(err,ret){
      if(err){
          console.log('查詢失敗')
      }else{
          console.log(ret)
      }
  })

  ```

* 查詢所有符合條件的數據

  使用 `User.find()` 方法裡面傳入回調函數 

  - 參數1 為條件 `{name:value}` , 參數2 為 `err` 錯誤對象, 參數3 為 `ret` 數據內容

  這裏以查詢密碼為 '123456' 為例 會返回所有符合條件的數據
  
  代碼如下：

  ```js

  User.find({password:'123456'},function(err,ret){
      if(err){
          console.log('查詢失敗')
      }else{
          console.log(ret)
      }
  })

  ```


### 5-3. 使用 `findOne()` 方法查詢單個數據

該方法得到的結果就不是一個數組 而是單一個數據對象 會返回符合條件的第一個數據對象

使用方法同按條件查詢數據的方式一樣 只是把 `User.find()` 改成 `User.findOne()` 即可

* 不傳第一個條件參數則默認獲取第一條數據 若找不到符合條件則返回 `null`

代碼如下：

```js

User.findOne({username:'cc'},function(err,ret){
    if(err){
        console.log('查詢失敗')
    }else{
        console.log(ret)
    }
})

```


### 5-4. 刪除數據

用 `User.remove()` 方法按條件刪除數據

使用方式同 `findOne` 直接傳入條件並給個回調函數即可

* 此方法也有 `ret` 但裡面的東西基本上用不到 不太重要

```js

User.remove({username:'cc'},function(err){
    if(err){
        console.log('刪除失敗')
    }
})

```


### 5-5. 利用 `id` 查找並更新該數據內容

使用 `User.findByIdAndUpdate()` 方法 參數1 傳入`id` 參數2 用對象傳入修改內容 參數3  回調函數

* 這裏回調函數中的 `ret` 是該 `id` 數據修改前的整個數據內容

代碼如下：

```js

User.findByIdAndUpdate('5f56364b347a37069f9e44e3',{email:'johnnn@test.com'},function(err,ret){
    if(err){
        console.log('更新失敗')
    }else(
        console.log(ret)
    )
})

```


## 6. 使用 `mongoose` 重做 `express-crud` 案例

將原本的 `express-crud` 專案複製到當前目錄中 改名為 `mongoose-crud`

刪除 `db.json` , 把 `students.js` 重寫為：

  * 安裝引入 `mongoose` 使用 `connent` 方法連結 `mongoDB` 數據庫

  * 設置 `Student` 集合為一個必須有 `id` `name` `gender` `message` 的結構

    - 先到 `mongo` 終端機裡手動添加一些數據進入 `students` 集合中

  * 使用 `exports.XXX = fn(callback)` 的方式創建查找所有的函數

    - 這裏直接用 `Student.find()` 方法 `callback` 傳 `ret` 即可獲得所有數據

    - 代碼如下：

    ```js

    exports.findAll = function (callback) {
        Student.find(function (err, ret) {
            if (err) {
                return callback(err)
            }
            callback(null, ret)
        })
    }

    ```

  * 使用 `exports.XXX = fn(ID,callback)` 的方式創建查找指定 `id` 的函數

    - 這裏直接用 `Student.findOne()` 方法 設條件為 `{id:ID}` 即可獲取指定的單條數據

    - 代碼如下：

    ```js
    
    exports.findById = function(ID,callback){
        Student.findOne({id:ID},function(err,ret){
            if (err) {
                return callback(err)
            }
            callback(null, ret)
        })
    }
    
    ```

  * 使用 `exports.XXX = fn(student,callback)` 的方式新增單條數據

    - 這裏先使用 `Student.find()` 方法獲取所有數據 拿到最後一個數據的 `id`
    
    - 將要新增的數據添加上 `id` 再用 `Student.save()` 方法保存該數據

    - 代碼如下：

    ```js

    exports.save = function(student,callback){
        Student.find(function(err,ret){
            if(err){
                return callback(err)
            }
            var id = parseInt(ret[ret.length - 1].id) + 1
            student.id = id
            var data = new Student(student)
            data.save(function (err) {
                if (err) {
                    return callback(err)
                }
                callback(null)
            })
        })
    }
    
    ```

    * 使用 `exports.XXX = fn(student,callback)` 的方式更改指定 `id` 的數據內容

      - 這裏用 `findOneAndUpdate()` 方法傳入條件 `{id:student.id}` 更改數據內容為 `student`

      - 代碼如下：

      ```js
      
      exports.updateById = function(student,callback){
          Student.findOneAndUpdate({id:student.id},student,function(err){
              if(err){
                  return callback(err)
              }
              callback(null)
          })
      }
      
      ```

    * 使用 `exports.XXX = fn(ID,callback)` 的方式刪除指定 `id` 的數據內容

      - 這裏用 `findOneAndDelete()` 方法傳入條件 `{id:ID}` 刪除該指定 `id` 數據

      - 代碼如下：

      ```js
      
      exports.deleteById = function (ID, callback) {
          Student.findOneAndDelete({id:ID},function(err){
              if (err) {
                  return callback(err)
              }
              callback(null)
          })
      }
      
      ```


## 7. 回調地獄與 `Promise`

當你為了獲取並操作異步方法通常要使用回調函數 

如果一段代碼瘋狂嵌套回調函數(俗稱回調地獄) 代碼整個看起來會很醜

為了解決這個代碼雜亂又醜陋的問題 在 `EcmaScript 6` 中產生了一個叫 `Promise` 的 API

`Promise` 是一個容器 它本身不是異步 只是容器內部存放的為異步操作任務

使用方式為：

* 創建變量 `p1` 為 new 一個 Promise 容器 裡面是一個回調函數 參數1為 `resolve` 參數2為 `reject`

  - `resolve` 表示成功， `reject` 表示失敗

  - `Promise` 容器中的異步任務 本身默認為 `pending` （待定）

  - 當異步任務執行後錯誤 則 `reject(err)` 這裏即把待定狀態改成失敗狀態

  - 當易步任務執行後成功 則 `resolve(data)` 這裏即把待定狀態改成成功狀態

* 使用 `p1.then()` 方法接收兩個回調函數 此回調函數就是剛才的 `resolve(data)` 和 `reject(err)`

  - 這裏是指 當 `p1` 執行完 然後做什麼 第一個回調函數是成功後做什麼 第二個是失敗後做什麼

  -  `function(data)` 等同於 `resolve(data)` 

  - `function(err)` 等同於 `reject(err)`

* 這時候你再創建變量 `p2` 一樣為 new 一個 Promise 容器 然後直接在 `p1.then()` 中的 `fn(data)` 裡 `return p2` 

  - 這裏你 `return` 什麼 後面繼續 `.then()` 就能得到什麼

  - 假設你 `return 123` 則在 `p1.then()` 後繼續 `.then()` 就能獲取 `123`

* 回到案例中我們繼續在 `p1.then()` 後面 `.then()` 即獲取 `p2` 的數據

* 以上就是解決地獄回調的方式 你可以發現 `.then()` 是平級的函數調用 不會變成亂七八糟一直往內縮進的代碼

整段代碼如下：

```js

var fs = require('fs')

var p1 = new Promise(function(resolve,reject){
    fs.readFile('./demo3-1.txt','utf8',function(err,data){
        if(err){
            reject(err)
        }
        resolve(data)
    })
})

var p2 = new Promise(function(resolve,reject){
    fs.readFile('./demo3-2.txt','utf8',function(err,data){
        if(err){
            reject(err)
        }
        resolve(data)
    })
})

p1
    .then(function(data){
        console.log(data)
        return p2
    },function(err){
        comsole.log(err)
    })
    .then(function(data){
        console.log(data)
    },function(err){
        comsole.log(err)
    })

```


## 8. `node.js` 中文件操作相關的全局成員（非模塊成員）

在 `node.js` 中的所有 `js` 文件裡默認有一些全局成員 如我們已知的 `require` `exports` 等

除了上述兩個成員外 還有兩個常用的成員為 `__dirname` `__filename`

`__dirname` 為動態獲取當前文件的絕對路徑但不包含文件本身 如： `/Users/Desktop/demo`

`__filename` 為動態獲取當前文件的完整絕對路徑 如： `/Users/Desktop/demo/demo1.js`

* 假設你更換目錄或更換電腦也不會出錯 因為他是在你執行開文件模塊時去取得絕對路徑的

* 因為動態獲取是不會受任何影響的 就是無論如何都會在你當前文件執行的過程中去取得該文件的絕對路徑

所以在 `express` 官網的中公開靜態資源的方式為 `app.use('/xx/',express.static(__dirname + '/xx/')`

這樣做的好處是 當你不在當前目錄操作入口文件時方便找到你公開資源的路徑

  * 因為 `node` 文件操作路徑默認是以執行命令的所處目錄路徑為準 
  
  * 所以你會發現當你切換目錄去執行文件操作的相關命令時 它會報錯返回找不到加載的文件

  * 這也是為什麼 `node` 建議使用絕對路徑來處理文件操作路徑的原因

  * 且這裏建議統一使用 `path.join(__dirname , 文件名)` 來取代手寫的絕對路徑 因為你的絕對路徑在別人電腦上無法使用

    - 這裏的 `path.join()` 是用來拼接路徑的方法 防止你多一個 `/` 或少一個 `/` 等問題

  * ***注意：以上主要是針對於讀取文件或處理靜態資源等文件操作路徑相關的，對於模塊路徑不受影響*** 

    - 假設你要在 `a.js` 文件中加載使用自定義模塊 `b.js` 還是使用相對路徑就可以了

    - 因為模塊路徑是跟隨當前文件的目錄尋找的，而不是像文件操作一樣是跟隨執行命令所處目錄尋找


## 9. 做一個可註冊登入登出的部落格案例

新增一個 `blog` 目錄 開啟終端機 創建 `package.json` 文件

先使用終端機安裝 `express` `mongoose` `art-template` `express-art-template` 第三方模塊

然後在 `blog` 目錄中新建 `public` 目錄 再在 `blog` 目錄中創建 `app.js` 入口文件 開啟服務器

然後加載核心模塊 `path` 使用 `path.join` 結合 `__dirname` 設置公開靜態資源

  * 公開靜態資源的代碼如下：

  ```js
  
  app.use('/public/', express.static(path.join(__dirname, '/public/')))
  app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

  ```

現在到 `blog` 目錄中新增一個 `views` 目錄存放所有要被渲染的 `html` 頁面檔案

### 9-1. `art-template` 提供的處理重複代碼方式

設置頁面 使用 `art-template` 模板引擎提供的編碼 把重複代碼做成 `layouts.html` 頁面

* 使用 `{{include 'html頁面'}}` 即可把寫好的 `html` 段落加載進 `layouts.html` 中

* `{{block aaa}}  {{/block}}` 這句是預留空間 裡面可放入一段默認內容

  - 當你在其他頁面中要引入 `layouts.html` 時 只需通過 `{{extend './layouts.html'}}` 即可

  - `{{extend './layouts.html'}}` 就是 繼承 `layouts.html` 的意思

  - 假設你沒有在引入 `layouts.html` 的頁面中使用 `{{block aaa}}取代默認內容的內容{{/block}}` 則會以默認內容渲染該頁面

`layouts.html` 語法如下：

```html

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>{{block 'title'}}默認標題{{/block}}</title>
  <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
  {{block 'head'}}{{/block}}
</head>

<body>
  {{include './header.html'}}

  {{block 'body'}}
  <h1>我是默認內容</h1>
  {{/block}}
  
  {{include './footer.html'}}
</body>

</html>

```

### 9-2. 在路由中使用數據庫集合的方式

在 `blog` 目錄中增加 `models` 目錄存放數據集合

這裏把數據歸類為用戶相關的 取名叫 `user.js`

回到 `app.js` 文件中 創建變量 `User = require('/models/user.js')`

在數據集合文件中則 加載引入 `mongoose` 連結到 `mongodb://localhost/blog` 數據庫

設置好集合結構 並使用 `moduls.exports = mongoose.model()` 導出集合模型對象

### 9-3. 處理註冊請求

先創建一個變量 `loginUser` 為空(裡面用來存放當前登入對象)

在註冊時 我們要判斷郵箱或暱稱是否已存在 如果存在則不能註冊

當使用 `findOne()` 方法傳入多個條件({條件1,條件2}) 其實是查找符合條件1且也符合條件2的結果

這裏我們要查找的方式是郵箱「或」暱稱是否符合 所以要使用 `$or` 操作符

* 這是 `mongoDB` 提供的「文檔操作符」 諸如此類的還有 `$nor` `$not` `$and` 等

* `$or:[{},{}]` 用來判斷符合條件1或條件2的文檔對象

* `$nor:[{},{}]` 用來判斷不符合條件的所有文檔對象

* `$not:[{}]` 用來判斷不符合該條件的文檔對象

* `$and:[{},{}]` 用來判斷符合條件1並符合條件2的文檔對象

* 用法為 `find( { 操作符 : [ {條件1} , {條件2} ] } , fn(){...})`

判斷郵箱或暱稱都不存在後即可使用 `new User()` 創建新用戶對象

這裏我們安裝加載第三方包 `blueipm-md5` 將該變量名設為 `md5` 它是一個密碼加密的工具

為了防止密碼被暴力破解我們使用 `md5(md5(password))` (把密碼加密兩次) 再傳入數據庫中

因為註冊可能出現信箱或密碼已被使用 要重新註冊的問題 這裏如果使用服務器去執行的話代碼會很繁雜

所以這裡我們處理成不使用表單的默認提交(即在頁面的表單中添加 `method` 和 `action`屬性)

改成使用異步表單提交(即`ajax`) 

***注意當使用異步提交就無法在服務端使用重定向***

* 因為服務端的重定向只針對同步請求才有效 所以這裏如果使用服務端重定向會無效化

而使用 `$ajax()` 須得到返回值為 `json` 數據

這裏如果使用 `res.send()` 方法要把字符串先轉 `json` 數據格式再傳送 這樣太麻煩了

`express` 為了處理這個情況 增加了一個 `res.json()` 方法

* 該方法會直接幫你把對象轉成 `json` 數據格式 這裏我們讓 `res.json()` 傳送 `err_code`

    - 當錯誤碼為`500`表示服務端有錯 當錯誤碼為`0`表示沒有重複直接完成註冊 當錯誤碼為`1`表示信箱或暱稱已存在

    - 再到 `register.html` 中的 `$ajax()` 判斷錯誤碼為多少 
    
    - 若為`0`則通過 `window.location.href = '/'` 跳轉至首頁

在註冊成功發送響應前 把 `user` 設為 `loginUser` 的值 這樣跳轉回首頁的同時就能默認登入狀態了

路由文件中的代碼如下：

```js

router.post('/register', function (req, res) {
    User.findOne({ $or: [{ email: req.body.email }, { nickname: req.body.nickname }] }, function (err, ret) {
        if (err) {
            return res.status(500).json({
                err_code: 500
            })
        }
        if (ret) {
            return res.status(200).json({
                err_code: 1
            })
        }

        req.body.password = md5(md5(req.body.password))

        new User(req.body).save(function (err,user) {
            if (err) {
                return res.status(500).json({
                    err_code: 500
                })
            }
            loginUser = user
            res.status(200).json({
                err_code: 0
            })
        })
    })
})

```

`html` 頁面中的 `ajax` 代碼如下：

```js

$('#register_form').on('submit', function (e) {
      e.preventDefault() // 阻止表單默認提交行為
      var formData = $(this).serialize()
      $.ajax({
        url: '/register',
        type: 'post',
        data: formData,
        dataType: 'json',
        success: function (data) {
          var err_code = data.err_code
          if (err_code === 0) {
            window.alert('註冊成功！')
            window.location.href = '/'
          } else if (err_code === 1) {
            window.alert('郵箱或暱稱已存在')
          } else if (err_code === 500) {
            window.alert('系統繁忙，請稍候重試。')
          }
        }
      })
    })

```

### 9-4. 處理登入請求

基本上都和註冊差不多 只是判斷條件變成符合信箱又符合密碼的才成功

這裡就直接使用 `User.findOne({條件1,條件2},fn(err,user){...})`

* 要注意一開始註冊的時候我們有對密碼進行二次加密 所以在判斷條件時也要判斷加密後的密碼才找得到

* 所以這裏判斷的密碼條件要寫為 `password: md5(md5(req.body.password))` 才對

判斷 當 `user` 存在即跳轉頁面登入 當 `user==='null'` 表示條件不符返回信箱或密碼錯誤

然後把 `findOne()` 得到的 `user` 設為 `loginUser` 的值 這樣跳轉回首頁就能傳入用戶對象了

路由文件中的代碼如下：

```js

router.post('/login', function (req, res) {
    User.findOne({ email: req.body.email , password: md5(md5(req.body.password)) }, function (err, user) {
        if (err) {
            return res.status(500).json({
                err_code: 500
            })
        }
        if (ret === 'null') {
            return res.status(200).json({
                err_code: 1
            })
        }

        loginUser = user
        res.status(200).json({
            err_code: 0
        })
    })
})

```

`html` 頁面中的 `ajax` 代碼如下：

```js

$('#login_form').on('submit', function (e) {
      e.preventDefault()
      var formData = $(this).serialize()
      console.log(formData)
      $.ajax({
        url: '/login',
        type: 'post',
        data: formData,
        dataType: 'json',
        success: function (data) {
          var err_code = data.err_code
          if (err_code === 0) {
            window.location.href = '/'
          } else if (err_code === 1) {
            window.alert('信箱或密碼錯誤')
          } else if (err_code === 500) {
            window.alert('系統繁忙，請稍候重試。')
          }
        }
      })
    })

```

### 9-5. 處理登出請求

登入時頁面右上角會出現一個小頭像跟箭頭 點擊後可以看到有個退出按鈕

我們到 `views` 目錄中的 `_partials` 裡找到 `header.html` 文件

把該退出路徑設為 `/logout` 然後回到路由文件中

直接將 `loginUser` 的值設為空 並重定向回首頁即完成登出請求