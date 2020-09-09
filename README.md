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


## 8. 補充兩個 `node.js` 中的全局成員（非模塊成員）

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


## 9. 用所學做一個部落格網站

新增一個 `blog` 目錄 開啟終端機 創建 `package.json` 文件

先使用終端機安裝 `express` `mongoose` 第三方模塊

然後在 `blog` 目錄中新建 `public` 目錄 再在 `blog` 目錄中創建 `app.js` 入口文件 開啟服務器

然後加載核心模塊 `path` 使用 `path.join` 結合 `__dirname` 設置公開靜態資源

  * 公開靜態資源的代碼如下：

  ```js
  
  app.use('/public/', express.static(path.join(__dirname, '/public/')))
  app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

  ```


