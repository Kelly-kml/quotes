/*
 * @Description: 
 * @author: kelly
 * @Date: 2023-11-27 08:50:04
 * @LastEditTime: 2023-11-27 09:02:17
 */
/**
 * 1. Promise构造函数：Promise(excutor){}
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

 */
/**
 * 1. Promise构造函数：Promise(excutor){}
   - excutor函数：执行器（resolve, reject) => {}
   - resolve函数：内部定义成功时我们调用的函数 value => {}
   - reject函数：内部定义失败时我们调用的函数 reason => {}
   说明：excutor会在Promise内部立即同步回调，异步操作在执行器中执行
 */
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