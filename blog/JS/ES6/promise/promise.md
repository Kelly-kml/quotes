## 一、前言

### 1.1.区别实例对象与函数对象

1. 实例对象：new 函数产生的对象，成为实例对象，简称对象
2. 函数对象：将函数作为对象使用时，简称为函数对

```js
function Fn(){
}
const fn = new Fn()//Fn是构造函数 fn是实例对象
console.log(Fn.prototype)
Fn.bind({})
$('#test') //$是jQuery函数
$.get(./test) // jQuery函数对象
```

### 1.2.二种类型的回调函数

#### 1.2.1. **同步**回调

1. 理解：立即执行，完全执行完了才结束，不会放进回调队列中
2. 例子：数组遍历相关的回调函数（Promise的excutor函数）

#### 1.2.2. **异步**回调

1. 理解：不会立即执行，会放入回调队列中将来执行
2. 例子：定时器回调 / ajax回调 / Promise 的成功|失败回调

```js
//同步回调
const arr = [1,2,3]
arr.forEach(item => { // 遍历回调，同步回调
    console.log(item)
})
console.log('forEach（）之后')

//异步回调
setTimeout(() =>{ // 异步回调，会放入队列中将来执行
    console.log('timeout callback()')
}, 0)
console.log('setTimeout()之后')
```



### 1.3. JS的error处理

#### 1.3.1[错误处理](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error)

Error：所有错误的父类型

2. ReferenceError：引用的变量不存在
3. TypeError：数据类型不正确的错误
4. RangeError：数据值不在其所允许的范围内
5. SyntaxError：语法错误

```js
//常见的内置错误
//1. ReferenceError：引用的变量不存在
console.log(a)//Uncaught ReferenceError: a is not defined

//2. TypeError：数据类型不正确的错误
let b =null
console.log(b.xxx)// Uncaught TypeError: Cannot read properties of null (reading 'xx')
let b ={}
console.log(b.xxx())//Uncaught TypeError: b.xxx is not a function

//3. RangeError：数据值不在其所允许的范围内
function(){
    fn()
}
fn()// RangeError: Maximum call stack size exceeded

//4. SyntaxError：语法错误
const c = """"//SyntaxError:Unexpected string
```

#### 1.3.2.错误处理

1. 捕获错误：try ... catch
2. 抛出错误：throw error

```js
//捕获错误：try ... catch
try {
    let d
    console.log(d.xxx)
} catch(error){
    console.log(error)
    // console.log(error.message)
    // console.log(error.stack)
}

//抛出错误：throw error
function something(){
    if(Date.now()%2===1){
        console.log('当前时间为奇数，可执行此任务')
    }else {// 如果时间为偶数就抛出异常，由调用来处理
        throw new Error('当前时间为偶数无法执行任务')
    }
}
// 捕获处理异常
try{
    something()
}catch(error){
    alert(error.message)
}
```

#### 1.3.3.错误对象

1. message：错误相关信息
2. stack：函数调用栈记录信息



## 二、Promise的理解和使用

### 2.1. Promise是什么？

#### 2.1.1.理解

1. 抽象表达:

   Promise是JS中进行异步编程的新的解决方案（旧的是谁？）

2. 具体表达:

   - 从语法上来说：Promise是一个构造函数
   - 从功能上来说：Promise对象用来封装一个异步操作并可以获取其结果

#### 2.1.2. Promise的状态改变 

1. pending 变为 resolved
2. pending 变为 rejected

说明：

- 只有这2种，且一个Promise对象只能改变一次
- 无论变为成功还是失败，都会有一个结果数据
- 成功的结果数据一般称为value，失败的结果数据一般称为reason

#### 2.1.3. Promise 的基本流程

![70101095914](C:\Users\ADMINI~1\AppData\Local\Temp\1701010959146.png)

#### 2.1.4 Promise 的基本使用

```js
// 1.创建一个新的Promise
const p = new Promise((resolve, reject) => {//执行器函数 （同步回调）
  console.log('执行 excutor')//控制台输出（1）
  // 2.执行异步操作任务
  setTimeout(() => {
    // 假设当前时间为偶数是成功，奇数为失败
    const time = Date.now();
    //3.1 如果成功的话，调用resolve(value)
    if (time % 2 == 0) {
      resolve('成功的数据， time=' + time)
    } else {
      // 3.2 如果失败的话。调用reject(reason)
      reject('失败的数据，time=' + time)
    }
  }, 1000)
})
console.log('new Promise（）之后')//控制台输出（2）

p.then(
  value => {// 接收得到成功的value数据  onSolved
    console.log('成功的回调', value)
  },
  reason => {// 接收得到失败的reason数据 onRejected
    console.log('失败的回调', reason)
  }
)
```

### 2.2. 为什么要用Promise？

#### 2.2.1指定回调函数的方式更加灵活

1. 没有Promise之前：必须在启动异步任务前指定
2. promise：启动异步任务 => 返回promise对象 => 给promise对象绑定回调函数（甚至可以在异步任务结束后指定/多个）

#### 2.2.2.支持链式调用，可以解决回调地狱的问题

1. 什么是回调地狱？

   回调函数嵌套调用，外部回调函数异步执行的结果是嵌套的回调执行的条件

   **纯函数的串联**

   ```js
   // 每一次失败或者成功的结果都要作为下一次回调的参数传入
   doSomething(function (result) {
     doSomething(result, function (newResult) {
       doSomething(newResult, function (finalResult) {
         console.log('Got the final result:' + finalResult)
       }, failureCallback)
     }, failureCallback)
   }, failureCallback)
   ```

2. 回调地狱的缺点？

   - 不便于阅读
   - 不便于异常处理

3. 解决方案？

   使用**Promise链式调用**来解决⭐⭐

   ```js
   // 得到一个Promise就启动一个异步任务
   doSomething().then(function(result){
     return doSomething(result)
   })
   .then(function(newResult){
     return doSomething(newResult)
   })
   .then(function(finalResult){
     console.log('Got the final result:' + finalResult)
   })
   .catch(failureCallback)//异常传透
   ```

   ​

4. 终极解决方案？

   **async/await**

   ```js
   async function request () {
     try {
       const result = await doSomething()
       const newResult = await doSomething(result)
       const finalResult = await doSomething(newResult)
       console.log('Got the final result:' + finalResult)
     } catch (error) {
       failureCallback(error);
     }
   }
   ```

   ​

### 2.3. 如何使用Promise？

#### 2.3.1. API

1. Promise构造函数：Promise（excutor){}

   - excutor函数：执行器（resolve, reject) => {}
   - resolve函数：内部定义成功时我们调用的函数 value => {}
   - reject函数：内部定义失败时我们调用的函数 reason => {}

   说明：excutor会在Promise内部立即同步回调，异步操作在执行器中执行

2. Promise.prototype.then方法：(onResolved，onRejected) => {}

   - onResolved函数：成功的回调函数 （value） => {}

   - onRejected函数：成功的回调函数 （reason） => {}

     说明：指定用于得到成功value的成功回调和用于得到失败reason的失败回调，返回一个新的promise对象

3. Promise.prototype.catch方法：(onRejected) => {}

   - onRejected函数：成功的回调函数 （reason） => {}

   说明：then()的语法糖，相当于then(undefined, onRejected)

4. Promise.resolve方法：（value）=> {}

   - value：成功数据 / promise 对象

     说明：返回一个成功 / 失败的promise对象

5. Promise.reject方法：（reason）=> {}

   - reason：失败原因

     说明：返回一个失败的promise对象

6. Promise.all方法：(promises) => {}

   - promises：包含n个promise对象的数组

     说明：返回一个新的promise，只有所有的promise都成功才是成功，只要有一个失败就是失败

7. Promise.race方法：(promises) => {}

   - promises：包含n个promise对象的数组

     说明：返回一个promise，第一个完成的promise结果状态就是最终的结果状态

   ```js
   new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve('成功数据')
       reject('失败数据')
     }, 1000)
   }).then(
     value => {
       console.log('onResolved()1', value)
     }
   ).catch(
     reason => {
       console.log('onRejected()1', reason)
     }
   )

   //产生一个成功值为1的promise对象
   const p1 = new Promise((resolve, reject) => {
     resolve(1)
   })
   const p2 = Promise.resolve(2)
   const p3 = Promise.reject(3)
   p1.then(value => console.log(value))
   p2.then(value => console.log(value))
   p3.then(reason => console.log(reason))

   const pAll = Promise.all([p1, p2, p3])
   pAll.then(
     value => {
       console.log('all onResolved()', value)
     },
     reason => {
       console.log('all onRejected()', reason)
     }
   )

   const pRace = Promise.race([p1, p2, p3])
   pRace.then(
     value => {
       console.log('race onResolved()', value)
     },
     reason => {
       console.log('race onRejected()', reason)
     }
   )
   ```

#### 2.3.2. Promise的几个关键问题

1. 如何改变promise的状态？

   - reslove(value)：如果当前是pedding就会变成resolved
   - reject(reason)：如果当前是pedding就会变成rejected
   - 抛出异常：如果当前是pedding就会变成rejected

2. 一个Promise指定多个成功/ 失败的回调函数，都会被调用吗？

   **当promise改变为对应状态时都会被调用**

   ```js
   const p = new Promise((resolve, reject) => {
     // resolve(1)// promise 变为resolved成功状态
     // reject(2)// promise 变为rejected失败状态
     // throw new Error('出错了') // 抛出异常，promise变为rejected失败状态，reason为抛出的error
     throw 3//error就为3
   })
   p.then(
     value => {
     },
     reason => {
       console.log('reason', reason)
     }
   )
   p.then(
     value => {
     },
     reason => {
       console.log('reason2', reason)
     }
   )
   // 同时调用两个p.then()方法，两个都会调用返回
   ```

   ​

3. 改变promise状态和指定回调函数谁先谁后？

   （1）都有可能，正常情况下是先指定回调再改变状态，但也可以先改变状态再指定回调

   （2）如何先改变状态再指定回调？

   - 在执行器中直接调用 resolve() / reject()
   - 延迟更长时间才调用 then()

   （3）什么时候才能得到数据？

   - 如果先指定的回调，那当状态发生改变时，回调函数就会调用，得到数据
   - 如果先改变的状态，那当指定回调时，回调函数就会被调用，得到数据

```js
	// 常规：先指定回调函数，再改变状态
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1)// 后改变的状态（同时指定函数），异步执行回调函数
      }, 1000)
    }).then(// 先指定回调函数，保存当前指定的回调函数
      value => { console.log('value', value) },//(2)
      reason => { console.log('reason', reason) }
    )
    // 怎么证明(2)同步还是异步？就看（1）和（2）的打印顺序
    console.log('================================')//(1)

    // 如何先改状态，后指定回调函数
    new Promise((resolve, rejected) => {
      resolve(1)// 先改变的状态（同时指定数据）
    }).then(//后指定回调函数，异步执行回调函数
      value => { console.log('value2', value) },
      reason => { console.log('reason', reason) }
    )

    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1)// 后改变的状态（同时指定函数），异步执行回调函数
      }, 1000)
    })
    setTimeout(() => {
      p.then(
        value => { console.log('value2', value) },
        reason => { console.log('reason', reason) }
      )
    }, 1100)
```

4. **Promise.then()返回的新promise的结果状态由什么决定？**⭐⭐⭐⭐⭐

- 简单表达：由then() 指定的回调函数执行的结果决定
- 详细表达：
  - 如果抛出异常，新的promise变为rejected，reason为抛出的异常
  - 如果返回的是非promise的任意值，新promise变为resolved，value为返回值
  - 如果返回的是另一个新promise，此promise的结果就会成为新promise的结果

```js
new Promise((resolve, rejected) => {
      // resolve(1)
      reject(1)
    }).then(
      value => {
        console.log('onResolved1()', value)
        // return 2
        // return Promise.resolve(3)
        // return Promise.reject(4)
        // throw 5
          //掌握这里的不同情况，下面then（）的执行结果情况
      },
      reason => {
        console.log('onRejected1()', reason)
      }
    ).then(
      value => {
        console.log('onResolved2()', value)
      },
      reason => {
        console.log('onRejected2()', reason)
      }
    )
```

5. promise如何串连多个操作任务？
   - promise的then()返回一个新的promise，可以开成then()的链式调用
   - 通过then的链式调用串连多个同步/异步任务

```js
    new Promise((resolve, rejected) => {
      setTimeout(() => {
        console.log("执行任务1（异步）")
        resolve(1)
      }, 1000)
    }).then(
      value => {
        console.log('任务1的结果', value)
        console.log('执行任务2（同步)')
        return 2
      }
    ).then(
      value => {
        console.log('任务2的结果', value)
        return new Promise(function (resolve, reject) {
          console.log('执行任务3（异步）')
          resolve(3)
        })
      }
    ).then(
      value => {
        console.log('任务3的结果', value)
      }
    )

//.html:27 执行任务1（异步）
//.html:32 任务1的结果 1
//.html:33 执行任务2（同步)
//.html:38 任务2的结果 2
//.html:40 执行任务3（异步）
//.html:46 任务3的结果 3
```

6. promise异常传透？
   - 当使用promise的then链式调用时，可以在最后指定失败的回调
   - 前面任何操作出了异常，都会传到最后失败的回调中处理


7. 中断Promise链？
   - 当使用promise的then链式调用时，在中间中断，不再调用后面的回调函数
   - 办法：在回调函数中返回一个pedding状态的promise对象

```js
new Promise((resolve, reject) => {
      // resolve(1)
      reject(1)
    }).then(
      value => {
        console.log('onResolved1()', value)
        return 2
      },
      // reason => {throw reason} 不写 ，失败回调的话默认是抛出异常  
    ).then(
      value => {
        console.log('onResolved2()', value)
        return 3
      },
      // reason => {throw reason} 不写 ，失败回调的话默认是抛出异常
    ).then(
      value => {
        console.log('onResolved3()', value)
      },
      // reason => {throw reason} 不写 ，失败回调的话默认是抛出异常
      // 也可以改为 reason => Promise.reject(reason)
    ).catch(reason => {
      // onRejected1() 1
      // 并不是直接跳到catch执行，是一步一步回调新的promise失败才最后执行catch
      console.log('onRejected1()', reason)
      return new Promise(() => { })//返回一个pedding的promise，后面的链式回调都不会执行了,即中断Promise
    }).then(
      value => {
        console.log('onResolved4()', value)
      },
      reason => {
        console.log('onRejected2()', reason)
      }
    )
```



## 三、自定义（手写）Promise

### 3.1. 定义整体结构

```js
/**
 * 自定义Promise函数模块
 */
(function Promise (window) {

  const PENDING = 'pending'
  const RESOLVED = 'resolved'
  const REJECTED = 'rejected'
  
  function Promise (excutor) {
    ...
  }
  
  // 暴露Promise
  window.Promise = Promise
  
})()
```



### 3.2. Promise构造函数的实现

```js
  function Promise (excutor) {

    const self = this

    // 如果当前状态不是pedding，直接结束
    if (self.status !== PENDING) {
      return
    }

    self.status = PENDING// 给promise对象指定status属性，初始值为pending
    self.data = undefined // 给promise对象指定一个用于存储结果数据的属性
    self.callbacks = []// 每个元素的结构： {onResolved（）{}，onRejected()}

    function resolve (value) {
      // 将状态改为resolved
      self.status = RESOLVED
      // 保存value数据
      self.data = value
      // 如果有待执行callbacks函数，立即异步执行回调函数onResolved
      if (self.callbacks.length > 0) {
        setTimeout(() => {// 放入队列中执行所有成功的回调
          self.callbacks.forEach(callbacksObj => {
            callbacksObj.onResolved(value)
          })
        })
      }
    }

    function reject (reason) {

      // 如果当前状态不是pedding，直接结束
      if (self.status !== PENDING) {
        return
      }

      // 将状态改为rejected
      self.status = REJECTED
      // 保存reason数据
      self.data = reason
      // 如果有待执行callbacks函数，立即异步执行回调函数onRejected
      if (self.callbacks.length > 0) {
        setTimeout(() => {// 放入队列中执行所有成功的回调
          self.callbacks.forEach(callbacksObj => {
            callbacksObj.onRejected(reason)
          })
        })
      }
    }

    // 立即执行excutor
    try {
      excutor(resolve, reject);
    } catch (error) {// 如果执行器抛出异常，promise对象变为rejected状态
      reject(error)
    }
  }
```

### 3.3. Promise.then()/catch()的实现

```js
  /**
   * Promise原型对象的then()
   * 指定成功和失败的回调函数
   * 返回一个新的Promise
   */
  Promise.prototype.then = function (onResolved, onRejected) {

    onResolved = typeof onResolved === 'function' ? onRejected : value => value// 向后传递成功的value


    // 指定默认的失败回调（实现错误/异步穿透的关键点）
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }//向后传递失败的reason

    const self = this

    // 返回一个新的promise对象
    return new Promise((resolve, reject) => {

      /**
       * 
       * @param {*} callback 调用指定的回调函数处理根据执行的结果，改变return的promise的状态
       */
      function handle (callback) {
        /*
          1.如果抛出异常，return的promise就会失败，reason就是error
          2.如果回调函数返回不是promise，return的promise就会成功，value就是返回值
          3.如果回调函数返回是promise，return的promise结果就是这个promise的结果
          */
        try {
          const result = onResolved(self.data)
          // 3.如果回调函数返回是promise，return的promise结果就是这个promise的结果
          if (result instanceof Promise) {
            // result.then(
            //   value => resolve(value),// 当result成功时，让return的promise也成功
            //   reason => reject(reason)// 当result失败时，让return的promise也失败
            // )
            //与上面分开写是一样的效果
            result.then(resolve, reject)
          } else {
            // 如果回调函数返回不是promise，return的promise就会成功，value就是返回值
            resolve(result)
          }
        } catch (error) {
          // 如果抛出异常，return的promise就会失败，reason就是error
          reject(error)
        }
      }


      // 当前状态还是pedding状态，将回调函数保存起来
      if (self.status === PENDING) {
        self.callbacks.push({
          onResolved (value) {
            handle(onResolved)
          },
          onRejected (reason) {
            handle(onRejected)
          }
        })
      } else if (self.status === RESOLVED) {//如果当前是resolved状态，异步执行onResolved并改变return的promise状态
        setTimeout(() => {
          handle(onResolved)

        })
      } else { // //如果当前是resolved状态，异步执行onRejected并改变return的promise状态
        setTimeout(() => {
          handle(onRejected)
        })
      }
    })


  }

  /**
   * Promise原型对象的catch()
   * 指定失败的回调函数
   * 返回一个新的Promise
   */
  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
  }
```



### 3.4. Promise.resolve()/reject()的实现

```js
  /**
   * Promise对象的resolve方法
   * 返回一个指定结果的成功的promise
   */
  Promise.resolve = function (value) {
    //返回一个成功/失败的promise
    return new Promise((resolve, reject) => {
      //value是promise
      if (value instanceof Promise) {// 使用value的结果作为promise的结果
        value.then(resolve, reject)
      } else {// value不是promise => promise 变为成功，数据为value
        resolve(value)
      }
      reject(reason)
    })
  }

  /**
   * Promise对象的reject方法
   * 返回一个指定结果的失败的Promise
   */
  Promise.reject = function (reason) {
    //返回一个失败的promise
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

```



### 3.5. Promise.all()/race()的实现

```js
/**
   * Promise对象的all方法
   * 返回一个Promise，只有当所有成功时才成功，否则失败
   */
  Promise.all = function (promises) {
    // 用来保存所有成功value的数组
    const values = new Array(promises.length)
    // 用来保存成功的promise数量
    let resolvedCount = 0

    return new Promise((resolve, reject) => {
      // 遍历promise
      promises.forEach((p, index) => {
        p.then(
          value => {
            resolvedCount++ // 成功的promise数量+1
            // p成功，将成功的value保存到values
            // values.push(value)
            values[index] = value

            // 如果全部成功了，将return的promise改变成功
            if (resolvedCount === promises.length) {
              resolve(values)
            }
          },
          reason => {// 只要一个失败了，return的promise就失败
            reject(reason)
          }
        )
      })
    })
  }

  /**
   * Promise对象的race方法
   * 返回一个Promise，第一个返回的就是结果，不管成功或失败
   */
  Promise.race = function (promises) {
    // 返回一个promise获取每个promise的结果
    return new Promise((resolve, reject) => {
      promises.forEach((p, index) => {
        p.then(
          value => {// 一旦有成功的，将return变为成功
            resolve(value)
          },
          reason => {// 一旦有失败了，将return变为失败
            reject(reason)
          }
        )
      })
    })
  }
```

### 3.6.完整版代码

```js
/*
 * @Description: 自定义Promise
 * @author: kelly
 * @Date: 2023-11-27 14:35:32
 * @LastEditTime: 2023-11-28 10:04:08
 */
/**
 * 自定义Promise函数模块
 */
(function Promise (window) {

  const PENDING = 'pending'
  const RESOLVED = 'resolved'
  const REJECTED = 'rejected'

  /**
   * Promise构造函数
   * excutor：执行器函数(同步执行)
   */
  function Promise (excutor) {

    const self = this

    // 如果当前状态不是pedding，直接结束
    if (self.status !== PENDING) {
      return
    }

    self.status = PENDING// 给promise对象指定status属性，初始值为pending
    self.data = undefined // 给promise对象指定一个用于存储结果数据的属性
    self.callbacks = []// 每个元素的结构： {onResolved（）{}，onRejected()}

    function resolve (value) {
      // 将状态改为resolved
      self.status = RESOLVED
      // 保存value数据
      self.data = value
      // 如果有待执行callbacks函数，立即异步执行回调函数onResolved
      if (self.callbacks.length > 0) {
        setTimeout(() => {// 放入队列中执行所有成功的回调
          self.callbacks.forEach(callbacksObj => {
            callbacksObj.onResolved(value)
          })
        })
      }
    }

    function reject (reason) {

      // 如果当前状态不是pedding，直接结束
      if (self.status !== PENDING) {
        return
      }

      // 将状态改为rejected
      self.status = REJECTED
      // 保存reason数据
      self.data = reason
      // 如果有待执行callbacks函数，立即异步执行回调函数onRejected
      if (self.callbacks.length > 0) {
        setTimeout(() => {// 放入队列中执行所有成功的回调
          self.callbacks.forEach(callbacksObj => {
            callbacksObj.onRejected(reason)
          })
        })
      }
    }

    // 立即执行excutor
    try {
      excutor(resolve, reject);
    } catch (error) {// 如果执行器抛出异常，promise对象变为rejected状态
      reject(error)
    }


  }

  /**
   * Promise原型对象的then()
   * 指定成功和失败的回调函数
   * 返回一个新的Promise
   */
  Promise.prototype.then = function (onResolved, onRejected) {

    onResolved = typeof onResolved === 'function' ? onRejected : value => value// 向后传递成功的value


    // 指定默认的失败回调（实现错误/异步穿透的关键点）
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }//向后传递失败的reason

    const self = this

    // 返回一个新的promise对象
    return new Promise((resolve, reject) => {

      /**
       * 
       * @param {*} callback 调用指定的回调函数处理根据执行的结果，改变return的promise的状态
       */
      function handle (callback) {
        /*
          1.如果抛出异常，return的promise就会失败，reason就是error
          2.如果回调函数返回不是promise，return的promise就会成功，value就是返回值
          3.如果回调函数返回是promise，return的promise结果就是这个promise的结果
          */
        try {
          const result = onResolved(self.data)
          // 3.如果回调函数返回是promise，return的promise结果就是这个promise的结果
          if (result instanceof Promise) {
            // result.then(
            //   value => resolve(value),// 当result成功时，让return的promise也成功
            //   reason => reject(reason)// 当result失败时，让return的promise也失败
            // )
            //与上面分开写是一样的效果
            result.then(resolve, reject)
          } else {
            // 如果回调函数返回不是promise，return的promise就会成功，value就是返回值
            resolve(result)
          }
        } catch (error) {
          // 如果抛出异常，return的promise就会失败，reason就是error
          reject(error)
        }
      }


      // 当前状态还是pedding状态，将回调函数保存起来
      if (self.status === PENDING) {
        self.callbacks.push({
          onResolved (value) {
            handle(onResolved)
          },
          onRejected (reason) {
            handle(onRejected)
          }
        })
      } else if (self.status === RESOLVED) {//如果当前是resolved状态，异步执行onResolved并改变return的promise状态
        setTimeout(() => {
          handle(onResolved)

        })
      } else { // //如果当前是resolved状态，异步执行onRejected并改变return的promise状态
        setTimeout(() => {
          handle(onRejected)
        })
      }
    })


  }

  /**
   * Promise原型对象的catch()
   * 指定失败的回调函数
   * 返回一个新的Promise
   */
  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
  }

  /**
   * Promise对象的resolve方法
   * 返回一个指定结果的成功的promise
   */
  Promise.resolve = function (value) {
    //返回一个成功/失败的promise
    return new Promise((resolve, reject) => {
      //value是promise
      if (value instanceof Promise) {// 使用value的结果作为promise的结果
        value.then(resolve, reject)
      } else {// value不是promise => promise 变为成功，数据为value
        resolve(value)
      }
      reject(reason)
    })
  }

  /**
   * Promise对象的reject方法
   * 返回一个指定结果的失败的Promise
   */
  Promise.reject = function (reason) {
    //返回一个失败的promise
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  /**
   * Promise对象的all方法
   * 返回一个Promise，只有当所有成功时才成功，否则失败
   */
  Promise.all = function (promises) {
    // 用来保存所有成功value的数组
    const values = new Array(promises.length)
    // 用来保存成功的promise数量
    let resolvedCount = 0

    return new Promise((resolve, reject) => {
      // 遍历promise
      promises.forEach((p, index) => {
        p.then(
          value => {
            resolvedCount++ // 成功的promise数量+1
            // p成功，将成功的value保存到values
            // values.push(value)
            values[index] = value

            // 如果全部成功了，将return的promise改变成功
            if (resolvedCount === promises.length) {
              resolve(values)
            }
          },
          reason => {// 只要一个失败了，return的promise就失败
            reject(reason)
          }
        )
      })
    })
  }

  /**
   * Promise对象的race方法
   * 返回一个Promise，第一个返回的就是结果，不管成功或失败
   */
  Promise.race = function (promises) {
    // 返回一个promise获取每个promise的结果
    return new Promise((resolve, reject) => {
      promises.forEach((p, index) => {
        p.then(
          value => {// 一旦有成功的，将return变为成功
            resolve(value)
          },
          reason => {// 一旦有失败了，将return变为失败
            reject(reason)
          }
        )
      })
    })

  }

  // 暴露Promise
  window.Promise = Promise

})(window)
```



## 四、async与await

目标：进一步掌握async/await的语法和使用

mdn文档：

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await

### async函数

1. 函数的返回值为Promise对象
2. promise对象的结果由async函数执行的返回值决定

### await函数

1. await右侧的表达式一般为promise对象，但也可以是其他的值

2. 如果表达式是promise 对象，await返回的是promise成功的值

3. 如果表达式是其他值，直接将此值作为await的返回值

   ​

### 注意：

1. await 必须写在async函数中，但async函数中可以没有await
2. 如果await的promise失败了，就会抛出异常，需要通过try...catch...来捕获处理