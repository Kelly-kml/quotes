---
title: ES6
date: 2024-02-13 19:49:34
categories:
  - 前端基础
tags:
  - ES6
  - Promise
  - 异步编程
---

## var/let/const 区别

主要从以下五点展开：

- 变量提升
- 暂时性死区
- 块级作用域
- 重复声明
- 修改声明的变量

### 变量提升

`var` 存在变量提升，即变量可以在声明之前调用，值为 `undefined`
`let`和 `const`不存在变量提升，即一定在先声明后调用

### 暂时性死区

`var` 不存在暂时性死区
`let`和 `const` 存在暂时性死区，只有等到声明变量的那一行代码出现，才能获取和使用该变量，即在声明之前都是不能使用的，处于暂时性死区

### 块级作用域

`var` 不存在块级作用域
`let`和 `const` 存在块级作用域

### 重复声明

`var` 允许重复声明变量
`let`和 `const` 在同一个作用域不允许重复声明变量

### 修改声明的变量

`var` 和 `let` 可以修改
`const`声明的是一个只读的常量，一旦声明了，常量的值就不能改变了。

⚠️ `const` 实际上保证的并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动

- 简单类型的数据，值保存在变量指向的那个内存地址，因此等同于常量
- 复杂类型的数据，变量指向的内存地址，保存的只是一个指向实际数据的指针，`const`只能保证这个指针是固定的，并不能确保变量的结构不变，例如：

```js
const foo = {};
// 可以为foo添加新属性
foo.prop = 123;
foo.prop; // 123
// 将foo 指向另一个对象会报错
foo = {}; // TypeError: "foo" is read-only
```

## ES6 中数组新增了哪些拓展

具体总结为以下几个方面：

- 扩展运算符的应用
- 构造函数新增的方法
- 实例对象新增的方法
- 空值处理
- sort()排序算法的稳定性

### 扩展运算符的应用

ES6 通过扩展运算符`...`，好比`rest`参数的逆运算，将一个数组转为用逗号分隔的参数序列

主要用于以下几种应用：

- 函数调用时，将一个数组变为参数序列
- 也可以将某些数据结构转为数组
- 能简单实现数组的复制（浅拷贝）
- 数组的合并也更为简洁
- 也可以将字符串转为真正的数组

```js
[...'hello']; //  [ "h", "e", "l", "l", "o" ]
```

- 定义了遍历器（Iterator）接口的对象，都可以用扩展运算符转为真正的数组；但是如果没有 Iterator 接口的对象，使用扩展运算符，将会报错

```js
let nodeList = document.querySelectorAll('div');
let array = [...nodeList];

let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

let arr = [...map.keys()]; // [1,2,3]

// 没有Iterator
const obj = { a: 1, b: 2 };
let arr = [...obj]; // TypeError: Cannot spread non-iterable object
```

⚠️ 注意：

通过扩展运算符实现的是`浅拷贝`，修改了引用指向的值，会同步反映到新数组
如果将扩展运算符用于数组赋值，只能放在参数的最后一位，不然会报错

### 构造函数新增的方法

构造函数新增的方法有：

- Array.from()
- Array.of()

#### Array.from()

将两类对象转为真正的数组：`类似数组的对象`和`可遍历（Iterator）对象`（包括 ES6 新增的数据结构 `Set` 和 `Map`）

```js
let arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
};
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
```

还可以接受第二个参数，用来对每个元素进行处理，将处理后的值放入返回的数组中

```js
Array.from([1, 2, 3, 4], (x) => x * x); // [1,4,9,16]
```

#### Array.of()

用于将一组值，转为数组

```javascript
Array.of(3, 2, 33, 66); // [3, 2, 33, 66]
```

`Array()`

没有参数时，返回一个空数组

当参数只有一个时，实际上是指指定数组的长度

参数个数不少于 2 个时，`Array()`才会返回由参数组成的新数组

```js
Array(); // []
Array(3); // [, , ,]
Array(3, 11, 8); // [3, 11, 8]
```

### 实例对象新增的方法

数组实例对象新增的方法：

- copyWithin()
- find()/findIndex()
- fill()
- entries()/keys()/values()
- includes()
- flat()/flatMap()

#### copyWithin()

将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组

参数：

- target（必需）：从该位置开始替换数据。如果为负值，表示倒数
- start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
- end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算

```js
[1, 2, 3, 4, 5].copyWithin(0, 3); //将从index=3的位置直到数组结束的元素（4,5），复制到从index=0 开始的位置，覆盖原来的（1,2）
// [4,5,3,4,5]
```

#### find()/findIndex()

`find()`用于找出第一个符合条件的数组元素值

参数是一个回调函数，接受三个参数，依次：当前值、当前值的位置和原数组

```js
[1, 4, 5, 10, 15].find((value, index, arr) => {
  return value > 11;
});
// 15
```

`findIndex()`返回第一个符合条件的数组元素的位置，如果没有符合条件，则返回-1

```js
[1, 4, 5, 10, 15].findIndex((value, index, arr) => {
  return value > 11;
});
// 4
```

这两个方法都可接受第二个参数，用来绑定回调函数的 `this`对象

```js
function f(v) {
  return v > this.age;
}
let person = { name: 'John', age: 20 };
[10, 12, 26, 15].find(f, person); // 26
```

#### fill()

使用给定值，填充一个数组

```js
['a', 'b', 'c'].fill(7);
// [7, 7, 7]
new Array(3).fill(7);
// [7, 7, 7]
```

还可以接受第二和第三个参数，用于指定填充位置的开始和结束位置，操作位置包括开始的位置，不包括结束的位置

```js
['a', 'b', 'c'].fill(7, 1, 2);
// ['a', 7, 'c']
```

⚠️ 如果填充的类型时对象，那么就是浅拷贝

#### entries()/keys()/values()

`keys()`：键名的遍历
`values()`：键值的遍历
`entries()`：键值对的遍历

#### includes()

用于判断数组是否包含给定值

```js
[1, 2, 3]
  .includes(2) // true
  [(1, 2, 3)].includes(4) // false
  [(1, 2, NaN)].includes(NaN); // true
```

可以接受第二个参数，默认为 0

参数为负值表示倒数的位置

```js
[1, 2, 3].includes(3, 3); // false
[1, 2, 3].includes(3, -1); // true
```

#### flat()/flatMap()

将数组扁平化处理，返回一个新数组，对原数据没有影响

```js
[1, 2, [3, 4]].flat();
//[1,2,3,4]
```

`flat()`默认只会拉平一层。如果需要拉平多层的嵌套数组，可以给`flat()`传入参数：层数。默认为 1

```javascript
[1, 2, [3, [4]]].flat();
// [1,2,3,[4]]

[1, 2, [3, [4]]].flat(2);
//[1,2,3,4]
```

`flatMap()`对原数组的每个成员执行一个函数相当于 `Array.prototype.map()`，然后对返回值组成的数组执行`flat()`方法。

该方法返回的是一个新数组，不改变原来数组

```js
[2, 3, 4].flatMap((x) => [x, x * 2]);
//  [2, 4, 3, 6, 4, 8]

// 相当于 [[2,4], [3,6], [4,8]].flat()
```

`flatMap()`还有第二个参数，用来绑定遍历函数里面的 `this`

## 函数新增的扩展

具体有哪些扩展：

- 参数
- 属性
- 作用域
- 严格模式
- 箭头函数

### 参数

ES6 允许为函数的参数设置默认值，并且函数的形参树默认声明的，不能使用`let`或`const`再次声明
参数的默认值应该是函数的`尾参数`，如果不是尾部的参数设置默认值，实际上这个参数是不能省略的。

```js
function f(x = 1, y) {
 return [x, y];
}
f() // [1, undefined]
f(2) // [2, undefined]
f(, 1) //会报错
f(undefined, 1) // [1, 1]
```

### 属性

#### length 属性：

`length`将返回没有指定默认值的参数个数

```js
(function (a, b, c = 5) {}).length; // 2
```

`rest`参数也不会计入`length`属性

```js
(function (...args) {}).length; // 0
```

如果设置了默认值的参数不是尾参数，那么 length 属性也不再计入后面的参数了

```js
(function (a = 0, b, c) {}).length; //0
(function (a, b = 1, c = 2) {}).length; //1
(function (a, b = 1, c) {}).length; //1
(function (a, b, c) {}).length; //3
```

#### name 属性：

`ES6`可以返回函数名

```js
var f = function () {};
// ES5
f.name; // ""
// ES6
f.name; // "f"
```

如果将一个具名函数赋值给一个变量，那么`name`属性都返回这个具名函数原本的名字

```js
const bar = function baz() {};
console.log(bar.name); // ’baz'
```

`Function`构造函数返回的函数实例，`name`属性的值为 `anonymous`

```javascript
new Function().name; // "anonymous"
```

`bind`返回的函数，`name`属性值会加上`bound`前缀

```javascript
function foo() {}
foo.bind({}).name; // "bound foo"

(function () {}).bind({}).name; // "bound"
```

### 作用域

一旦设置了参数的默认值，函数进行声明初始化时，参数就会形成一个单独的作用域，等待初始化结束，这个作用域就会消失。

这种行为，在不设置参数默认值时，是不会出现的

```js
let x = 1;
function f(y = x) {
  // 等同于 let y = x
  let x = 2;
  console.log(y);
}
f(); // 1
```

⚠️ 为什么返回打印的是`1`？
在形参时声明`x`的值赋值给`y`，所以初始进入函数，还没执行到`x`的新赋值，只能将全局的`=1`赋值给`y`，因此，在函数执行结束时：`x=2`，`y=1`

### 严格模式

只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内就不能显示设定为严格模式，否则会报错

### 箭头函数

⚠️ 注意点：

- 函数体内的`this`对象，就是定义时所在的对象，而不是使用时所在的对象
- 不可以当做构造函数，即，不可以使用`new`命令，否则会抛错
- 不可以使用`arguments`对象，该对象在函数体内不存在。如果要实现该功能，可以用`rest`参数代替
- 不可以使用`yield`命令，一年春箭头函数也不能使用`Generator`函数

## 对象新增了哪些扩展？

### super 关键字

我们知道的：`this`关键字总是指向函数所在的当前对象，`ES6`又新增了另一个类似的关键字`super`，指向当前对象的原型对象

```js
const proto = {
  foo: 'hello',
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  },
};

Object.setPrototypeOf(obj, proto);
obj.find(); // "hello"
```

上面代码中，对象 obj.find()方法之中，通过 super.foo 引用了原型对象 proto 的 foo 属性。

⚠️ 注意：super 关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错。

```js
// 报错
const obj = {
  foo: super.foo,
};

// 报错
const obj = {
  foo: () => super.foo,
};

// 报错
const obj = {
  foo: function () {
    return super.foo;
  },
};
```

上面三种 super 的用法都会报错，因为对于 `JavaScript 引擎`来说，这里的 super 都没有用在对象的方法之中。第一种写法是`super`用在属性里面，第二种和第三种写法是`super`用在一个函数里面，然后赋值给`foo`属性。目前，只有对象方法的简写法可以让 `JavaScript 引擎`确认，定义的是对象的方法。

JavaScript 引擎内部，`super.foo`等同于`Object.getPrototypeOf(this).foo（属性）`或`Object.getPrototypeOf(this).foo.call(this)（方法）`

```js
const proto = {
  x: 'hello',
  foo() {
    console.log(this.x);
  },
};

const obj = {
  x: 'world',
  foo() {
    super.foo();
  },
};

Object.setPrototypeOf(obj, proto);

obj.foo(); // "world"
```

上面代码中，super.foo 指向原型对象 proto 的 foo 方法，但是绑定的 this 却还是当前对象 obj，因此输出的就是 world。

### 属性名表达

可以采用字面量定义，将表达式写在括号里

也可以使用`[]`的方式书写

### 扩展运算符`...`

### 属性的遍历

ES6 一共有 5 种方法可以遍历对象的属性

- for...in：循环遍历对象自身和继承可枚举属性（不含 Symbol 属性）
- Object.keys(obj): 返回一个数组，包括对象自身（不含继承）所有枚举属性（不包含 Symbol 属性）的键名
- Object.getOwnPropertyNames(obj): 返回一个数组，包含对象自身所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名
- Object.getOwnPropertySymbols(obj): 返回一个数组，包括对象自身所有的 Symbol 属性的键名
- Reflect.ownKeys(Obj): 返回一个数组，包括对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举

上述遍历，都遵循同样的属性遍历的次序规则：

- 首先遍历所有数值键，按照数值升序排列
- 其次遍历所有字符串键，按照加入时间升序排列
- 最后遍历所有 Symbol 键，按照加入时间生序排列

```js
Reflect.ownKeys({ [Symbol()]: 0, b: 0, 10: 0, 2: 0, a: 0 });
// ['2', '10', 'b', 'a', Symbol()]
```

### 对象新增的方法

新增的方法有：

- Object.is()
- Object.assign()
- Object.getOwnPropertyDescriptors()
- Object.setPrototypeOf(),Object.getPrototypeOf()
- Object.keys(),Object.values(),Object.entries()
- Object.fromEntries()

#### Object.is()

严格判断两个值是否相等，与严格比较运算符（===）的行为基本一致，不同之处有 2 个：

- `+0` 不等于 `-0`
- `NaN`等于自身

```javascript
+0 === -0; // true
NaN === NaN; //false

Object.is(+0, -0); // false
Object.is(NaN, NaN); // true
```

#### Object.assign()

用于对象的合并，将源对象`source` 的所有可枚举属性，复制到目标对象`target`

第一个参数是目标对象，后面的参数都是源对象

```js
const target = { a: 1, b: 1 };
const source1 = { b: 2, c: 2 };
const source2 = { c: 3 };
Object.assign(target, source1, source2);
target; // {a:1, b:2, c:3}
```

⚠️ Object.assign()是浅拷贝，遇到同名属性就替换，去重

#### Object.getOwnPropertyDescriptors()

返回指定对象所有自身属性（非继承属性）的描述对象

```javascript
const obj = {
  foo: 123,
  get bar() {
    return 'abc';
  },
};
Object.getOwnPropertyDescriptors(obj);
// { foo:
// { value: 123,
// writable: true,
// enumerable: true,
// configurable: true },
// bar:
// { get: [Function: get bar],
// set: undefined,
// enumerable: true,
// configurable: true } }
```

#### Object.setPrototypeOf()

用来设置一个对象的原型对象

#### Object.getPrototypeOf()

用来读取一个对象的原型对象

#### Object.keys()

返回自身的（不含继承的）所有可遍历（enumerable）属性的键名的数组

#### Object.values()

返回自身的（不含继承的）所有可遍历（enumerable）属性的键对应的数组

#### Object.entries()

返回一个对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对的数组

#### Object.fromEntries()

返回将一个键值对数组转为对象

```js
Object.fromEntries([
  ['foo', 'bar'],
  ['baz', 42],
]);
// { foo: "bar", baz: 42 }
```

## Promise

![异步编程之Promise](https://kelly-kml.github.io/kelly240112.github.io/articles/2024/02/27/%E5%BC%82%E6%AD%A5%E7%BC%96%E7%A8%8B/)

## Generator

### 是什么？

执行`Generator`函数会返回一个遍历器对象，可以依次遍历`Generator`函数内部的每一个状态
形式上，`Generator`函数是一个普通的函数，但是有 2 个特征：

- function 关键字与函数名之间有一个星号
- 函数体内使用`yield`表达式，定义不同的内部状态

### 使用

`Generator`函数会返回一个遍历器对象，即具有`Symbol.iterator`属性，并且返回给自己

```javascript
function* gen() {
  //...
}

var g = gen();
g[Symbol.iterator]() === g; // true
```

通过`yield`关键字可以暂停`generator`函数返回的遍历器对象的状态

```javascript
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
var hw = helloWorldGenerator();
```

上述三种状态：`hello`、 `world`、 `return`

通过`next`方法才会遍历到下一个内部状态，其运行逻辑如下：

- 遇到`yield`表达式，就暂停执行后面的操作，并将紧跟在`yield`后面的那个表达式的值，作为返回的对象的`value`属性值
- 下一次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`表达式
- 如果没有再遇到新的`yield`表达式，就一直运行到函数结束，直到遇到`return`为止，并将`return`语句后面的表达式的值，作为返回对象的`value`属性值
- 如果该函数没有`return`，则返回对象的`value`属性值为`undefined`

```javascript
hw.next();
// { value: 'hello', done: false }
hw.next();
// { value: 'world', done: false }
hw.next();
// { value: 'ending', done: true }
hw.next();
// { value: undefined, done: true }
```

`done`判断是否存在下一个状态，`value`对应状态值
`yield`本身没返回值，或者说只能返回`undefined`
通过调用`next`方法可以带一个参数，该参数就会被当做上一个`yield`表达式的返回值

```javascript
function* foo(x) {
  var y = 2 * (yield x + 1);
  var z = yield y / 3;
  return x + y + z;
}
var a = foo(5);
a.next(); // Object{value:6, done:false}
a.next(); // Object{value:NaN, done:false}
a.next(); // Object{value:NaN, done:true}
var b = foo(5);
b.next(); // { value:6, done:false }
b.next(12); // { value:8, done:false }
b.next(13); // { value:42, done:true }
```

正因为`Generator`返回`Iterator`对象，因此，我们可以通过`for...of`进行遍历

```javascript
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}
for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

原生对象没遍历接口，通过`Generator`函数为他加上这个接口，就能使用`for...of`进行遍历

```js
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);
  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}
let jane = { first: 'Jane', last: 'Doe' };
for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe
```

### 使用场景

`Generator`是异步解决的一种方案，最大特点则是将异步操作同步化表达出来

```js
function* loadUI() {
  showLoadingScreen();
  yield loadUIDataAsynchronously();
  hideLoadingScreen();
}
var loader = loadUI();
// 加载UI
loader.next();

// 卸载UI
loader.next();
```

包括`redux-saga`中间件也充分利用了`Generator`特性

```js
import { call, put, takeEvery, takeLastest } from 'redux-saga/effects';
import Api from '...';
function* fetchUser(action) {
  try {
    const user = yield call(Api.fetchUser, action.payload.userId);
    yield put({ type: 'USER_FETCH_SUCCEEDED', user: user });
  } catch (e) {
    yield put({ type: 'USER_FETCH_FAILED', message: e.message });
  }
}

function* mySaga() {
  yield takeEvery('USER_FETCH_REQUESTED', fetchUser);
}

function* mySaga() {
  yield takeLatest('USER_FETCH_REQUESTED', fetchUser);
}

export default mySaga;
```

还能利用`Generator` 函数，在对象上实现`Iterator`接口

```js
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}

// foo 3
// bar 7
```

## Javascript 异步编程

Javascript 编程是什么？有什么方案？

**回答关键点：**阻塞、事件循环、回调函数

Javascript 是一种同步的、阻塞的、单线程的语言，一次只能执行一个任务。但是浏览器定义了非同步的 Web APIs，将回调函数插入到事件循环中，实现异步任务的非阻塞执行。

常见的异步方案有异步回调、定时器、发布/订阅模式、Promise、生成器 Generator、async/await 以及 Web Worker。

### 异步回调：

- 是非线性的，非顺序的，理解成本较高

- 多层嵌套回调会产生回调地狱

  ​

### 定时器

`setTimeout` `setInterval` `requestAnimationFrame`都是异步方式。

- setTimeout：经过任意时间后运行函数，**递归 setTimeout 在 JavaScript 线程不阻塞的情况下可保证执行间隔相同**。

- setInterval：允许重复执行一个函数，并设置时间间隔，**不能保证执行间隔相同**。

- requestAnimationFrame：以**当前浏览器/系统的最佳帧速率**重复且高效地运行函数的方法。一般用于处理动画效果。

  ​

如果当前 Javascript 线程阻塞，轮到的 setInterval 无法执行，那么本次任务就会被丢弃。而 setTimeout 被阻塞后不会被丢弃，等到空闲时会继续执行，但无法保证执行间隔。

### 发布/订阅：

**发布/订阅模式是一种对象间一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到状态改变的通知。**

### Promise

`Promise` 就是为了解决回调地狱而产生的，将回调函数的嵌套，改为链式调用。

Promise 提供了完成和拒绝两个状态来标识异步操作结果，通过 then 和 catch 可以分别对着两个状态进行跟踪处理和事件监听的主要差别在于：

（1）一个`Promise`只能成功或失败一次，一旦状态改变，就无法从成功切换到失败，反之亦然。

（2）如果`Promise`成功或失败，那么即使在事件发生之后添加成功/失败回调，也将调用正确的回调。

`Promise`使用顺序的方式来表达异步，将回调的控制权转交给可以信任的`Promise.resolve()`，同时也能够使用链式流的方式避免回调地狱的产生，解决了异步回调的问题。但是`Promise`也有缺陷：

（1）顺序错误处理：如果不设置回调函数，`Promise`链中的错误很容易被忽略。

（2）单决议：`Promise`只能决议一次（完成或者拒绝)，不能很好的支持多次触发的事件及数据流（支持的标准正在制定中）

（3）无法获取状态：处于`pending`状态是，无法得到目前进展到哪一个阶段（刚刚开始即将完成）

（4）无法取消：一旦创建了`Promise`并注册了完成/拒绝函数，就不能取消执行

详细解析请点击此处：[👉](https://kelly-kml.github.io/kelly240112.github.io/articles/2024/02/27/%E5%BC%82%E6%AD%A5%E7%BC%96%E7%A8%8B/)

参考文档：[想想详细](https://github.com/zcxiaobao/zcBlog/tree/main/promise)

### 生成器 Generator

`Generator` 函数是 `ES6` 提供的一种异步编程解决方案，语法与传统函数完全不同，最大的特点就是可以控制函数的执行。

`yield` 可以暂停函数执行，`next` 用于恢复函数执行，这使得`Generator`函数非常适合将一部任务同步化

```js
function* helloHzfeGenerator() {
  yield 'hello';
  yield 'hzfe';
  return 'ending';
}

var hello = helloHzfeGenerator();

hello.next();
// {value: 'hello', done: false}

hello.next();
// {value: 'hzfe', done: false}

hello.next();
// {value: 'ending', done: true}

hello.next();
// {value: undefined, done: true}
```

Generator 并不想普通函数那样总是运行到结束，可以运行当中通过 yield 来暂停并完全保持其状态，再通过 next 恢复运行。yield/ next 不只是控制机制，也是一种双向消息传递机制。yield 表达式本质上是暂停下来等待某个值，next 调用会被暂停的 yield 表达式传回一个值（或者是隐式的 undefined)。

生成器 Generator 保持了顺序、同步、阻塞的代码模式，同样解决了异步回调的问题。

### async/await

`await`内部实现了`generator`，其实`await`其实就是 Generator + promise 的语法糖，且内部实现了自动执行 `generator`。

#### async 函数

- 函数的返回值为 `promise` 对象
- `promise` 对象的结果由 `async` 函数执行的返回值决定

#### await 表达式

- await 右侧的表达水一般为 `promise`对象，但也可以是其他的值
- 如果表达式是`promise`对象，`await`返回的就是`promise`成功的值
- 如果表达式是其它值, 直接将此值作为 await 的返回值

#### 注意

- await 必须写在 async 函数中, 但 async 函数中可以没有 await
- 如果 await 的 promise 失败了, 就会抛出异常, 需要通过 `try...catch` 捕获处理

#### 看起来异步代码看起来更像是同步代码，具有如下特点：

- `async/await` 不能用于普通的回调函数

- `async/await` 与 `Promise` 一样，是非阻塞的

- `async/await` 使得异步代码看起来像同步代码

  ​

#### `async/await` 也存在问题以及解决方案：

**问题**：

await 关键字会阻塞其后的代码，直到 Promise 完成，就像执行同步操作一样。

他们可以允许其他任务在此期间继续运行，但是自己的代码会被阻塞。

**解决方案**：

将 Promise 对象存储在变量中来同时开始，然后等待他们全部执行完毕。如果内部的 await 等待的异步任务之间没有依赖关系，且需要获取这些异步操作的结果，可以使用 Promise.allSettled()同时执行这些任务并获得结果。

```js
function fn1() {
  return Promise.resolve(1);
}
function fn2() {
  return 2;
}
function fn3() {
  return Promise.reject(3);
  // return fn3.test() // 程序运行会抛出异常
}
function fn4() {
  return fn3.test(); // 程序运行会抛出异常
}
// 没有使用 await 的 async 函数
async function fn5() {
  return 4;
}
async function fn() {
  // await 右侧是一个成功的 promise

  const result = await fn1();
  // await 右侧是一个非 promise 的数据
  // const result = await fn2()
  // await 右侧是一个失败的 promise
  // const result = await fn3()
  // await 右侧抛出异常
  // const result = await fn4()
  console.log('result: ', result);
  return result + 10;
}
async function test() {
  try {
    const result2 = await fn();
    console.log('result2', result2);
  } catch (error) {
    console.log('error', error);
  }
  const result3 = await fn4();
  console.log('result4', result3);
}
test();
```

### Web Worker

（1）**Web Worker 为 JavaScript 创造了多线程环境**，允许主线程创建 Worker 线程，将一些任务分配给 Worker 线程运行，处理完后可以通过 postMessage 将结果传递给主线程。优点在于可以在一个单独的线程中执行费时的处理任务，从而允许主线程中的任务（通常是 UI）运行不被阻塞。

（2）使用 Web Worker 时有以下三点需要注意：

- **在 Worker 内部无法访问主线程的任何资源**，包括全局变量，页面的 DOM 或者其他资源，因为这是一个完全独立的线程。
- **Worker 和主线程间的数据传递通过消息机制进行**。使用 postMessage 方法发送消息；使用 onmessage 事件处理函数来响应消息。
- **Worker 可以创建新的 worker，新的 worker 和父页面同源**。Worker 在使用 XMLHttpRequest 进行网络 I/O 时，XMLHttpRequest 的 responseXML 和 channel 属性会返回 null。

（3）Web Worker 主要应用场景：

1. 处理密集型数学计算
2. 大数据集排序
3. 数据处理（压缩，音频分析，图像处理等）
4. 高流量网络通信

### 总结：

#### 回调函数（setTimeout）

**缺点：产生回调地狱，不能用`try...catch`捕获错误，不能 return **

回调地狱的根本问题在于：

- 缺乏顺序性：回调地狱导致的调试困难，和大脑的思维方式不符
- 嵌套函数存在耦合性，一旦有所改变，就会牵一发而动全身，即（控制反转）
- 嵌套函数过多的话，很难处理错误

**优点：解决了同步的问题**（只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。）

#### Promise

Promise 就是为了解决 callback 的问题而产生的。

Promise 实现了链式调用，也就是说每次 then 后返回的都是一个全新 Promise，如果我们在 then 中 return ，return 的结果会被 Promise.resolve() 包装

**优点：解决了回调地狱**

**缺点：无法取消 Promise ，错误需要通过回调函数来捕获**

#### Generator

**特点：可以控制函数的执行**，可以配合 co 函数库使用

#### async/await

async、await 是异步的终极解决方案

**优点：代码清晰，不用像 Promise 写一大堆 then 链，处理了回调地狱的问题**

**缺点：await 将异步代码改造成同步代码，如果多个异步操作没有依赖性而使用 await 会导致性能上的降低。**

### ⚠️ 区别注意：

- `promise` 和 `async/await`是专门用于处理异步操作的
- `Generator` 并不是为异步而设计的，它还有其他功能（对象迭代、控制输出、部署`Iterator`接口...）
- `promise` 编写代码相比`Generator`、`async`更为复杂，且可读性稍差
- `Generator`、 `async`需要与`promise`对象搭配处理异步情况
- `async`实质上是`Generator`的语法糖，相当于会自动执行`Generator`函数
- `async`使用上更为简洁，将异步代码以同步的形式进行编写，是处理异步编程的最终方案

## Set、Map 两种新的数据结构

`Set`是一种叫做`集合`的数据结构
`Map`是一种叫做`字典`的数据结构

- 集合（Set）

是由一堆无序的、相关联的，且不重复的内部结构（数学中称为元素）组成的组合

- 字典（Map）

是一些元素的集合。每个元素都有一个称为 key 的域，不同元素的 key 各不相同

区别？

- 共同点：集合和字典都可以存储不重复的值

- 不同点：集合是以[值，值]的形式存储元素，字典是以[键，值]形式存储的

### Set

#### Set 的实例关于增删改查的方法

- add()

添加某个值，返回 Set 结构本身

当添加的值已经存在了，不会二次添加，即集合内的元素是不重复的

- delete()

删除某个值，返回布尔值，表示删除成功与否

- has()

返回布尔值，判断该值是否为 Set 的成员

- clear()

清除所有成员，没有返回值

#### 实例遍历的方法

`Set`遍历顺序就是插入顺序

- keys() -- 遍历属性名
- values() -- 遍历属性值
- entries() -- 遍历键值对

```js
let set = new Set(['red', 'green', 'blue']);
for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue
for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue
for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

- forEach()

用于对每个成员执行某种操作，没有返回值，键值、键名都相等，同样的`forEach`方法有第二个参数，用来绑定处理函数的`this`

```javascript
let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value));
// 1 : 1
// 4 : 4
// 9 : 9
```

#### 应用场景

- 扩展运算符和`Set`结构相结合可以实现数组或字符串去重

```javascript
// 数组
let arr = [3, 5, 2, 2, 5, 5];
let unique = [...new Set(arr)]; // [3, 5, 2]

// 字符串
let str = '352255';
let unique = [...new Set(str)].join(''); // "352"
```

- 实现并集、交集和差集

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

//并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

//交集
let intersect = new Set([...a].filter((x) => b.has(x)));
// set {2, 3}

// a相对于 b的差集
let difference = new Set([...a].filter((x) => !b.has(x)));
// Set {1}
```

### Map

`Map`类型时键值对的有序列表，而键和值都可以是任意类型
`Map`本身是一个构造函数，用来生成`Map`数据结构

#### 实例关于增删改查的属性和操作方法

- size()
  返回 `Map` 结构的成员总数

```js
const map = new Map();
map.set('foo', true);
map.set('bar', false);
map.size; // 2
```

- set()

设置键名 key 对应的键值为 value，然后返回整个 Map 结构
如果 key 已经有值，则键值会被更新，否则就新生成该键
同时返回的是当前 Map 对象，可采用链式写法

```js
const m = new Map();
m.set('edition', 6); // 键是字符串
m.set(262, 'standard'); // 键是数值
m.set(undefined, 'nah'); // 键是 undefined
m.set(1, 'a').set(2, 'b').set(3, 'c'); //链式操作
```

- get()
  用于读取 key 对应的键值，如果找不到 key，就返回 undefined

```js
const m = new Map();
const hello = function () {
  console.log('hello');
};
m.set(hello, 'Hello ES6!'); // 键是函数
m.get(hello); // Hello ES6!
```

- has()
  返回一个布尔值，表示某个键是否存在当前 Map 对象中

```js
const m = new Map();
m.set('edition', 6);
m.set(262, 'standard');
m.set(undefined, 'nah');
m.has('edition'); // true
m.has('years'); // false
m.has(262); // true
m.has(undefined); // true
```

- delete()
  用于删除某个键，失败返回`false`

- clear()
  用于清除所有成员，没返回值

#### 实例遍历的方法

`Map`遍历顺序就是插入顺序

- keys() -- 遍历键名的遍历器
- values() -- 遍历键值的遍历器
- entries() -- 遍历键值对的遍历器
- forEach() -- 遍历所有成员

```js
const map = new Map([
  ['F', 'no'],
  ['T', 'yes'],
]);
for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用 map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

map.forEach(function (value, key, map) {
  console.log('Key: %s, Value: %s', key, value);
});
```

### WeakSet 和 WeakMap

#### WeakSet

创建 WeakSet 实例：

```javascript
const ws = new WeakSet();
```

`WeakSet`可以接受一个具有`Iterator`接口的对象作为参数

```javascript
const a = [
  [1, 2],
  [3, 4],
];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}
```

在 API 中 WeakSet 与 Set 有两个区别：

- 没有遍历操作的 API
- 没有`size`属性

`WeakSet`成员只能是引用类型，而不能是其他类型的值

```javascript
let ws = new WeakSet();

// 成员不是引用类型
let weakSet = new WeakSet([2, 3]);
console.log(weakSet); // 报错

// 成员为引用类型
let obj1 = { name: 1 };
let obj2 = { name: 1 };
let ws = new WeakSet([obj1, obj2]);
console.log(ws); //WeakSet {{…}, {…}}
```

`WeakSet`里面的引用只要在外部消失，她在 WeakSet 里面的引用就会自动消失

#### WeakMap

在 API 中`WeakMap` 和`Map`有两个区别：

- 没有遍历操作的 API
- 没有`clear`清空方法

```js
// WeakMap可以使用 set方法添加成员
const wm1 = new WeakMap();
const key = { foo: 1 };
wm1.set(key, 2);
wm1.get(key); // 2

// WeakMap 也可以接受一个数组
// 作为构造函数的参数
const k1 = [1, 2, 3];
const k2 = [4, 5, 6];
const wm2 = new WeakMap([
  [k1, 'foo'],
  [k2, 'bar'],
]);
wm2.get(k2); // "bar"
```

`WeakMap`只接受对象作为键名（null 除外），不接受其他类型的值作为键名

```js
const map = new WeakMap();
map.set(1, 2);
// TypeError: 1 is not an object!
map.set(Symbol(), 2);
// TypeError: Invalid value used as weak map key
map.set(null, 2);
// TypeError: Invalid value used as weak map key
```

`WeakMap`的键名所指向的对象，一旦不在需要，里面的键名对象和所对应的键值对会自动消失，不用手动删除引用

举个 🌰

当网页的 DOM 元素上添加数据，就可使用 WeakMap 结构，当该 DOM 元素被清除，其对应的 WeakMap 记录就会自动被移除

```js
const wm = new WeakMap();
const element = document.getElementById('example');
wm.set(element, 'some information');
wm.get(element); // "some information"
```

注意：`WeakMap`弱引用的只是键名，而不是键值。键值依然是正常引用

下面代码中，键值会在 WeakMap 产生新的引用，当你修改 obj 不会影响到内部

```js
const wm = new WeakMap();
let key = {};
let obj = { foo: 1 };
wm.set(key, obj);
obj = null;
wm.get(key);
// Object {foo: 1}
```

## proxy

### 如何使用：

`proxy`是构造函数，用来生成`proxy`实例

```js
var proxy = new Proxy(target, handler);
```

#### 参数如下：

`target` 表示所有拦截的目标对象（任何类型的对象，包括原生数组、函数，甚至另一个代理）
`handler`通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理`p`的行为

#### handler 拦截属性如下：

- get(target, propKey, receiver):拦截对象属性的读取
- set(target, propKey, value, receiver):拦截对象属性的设置
- has(target, propKey):拦截`propKey in proxy`的操作，返回一个布尔值
- deleteProperty(target, propKey):拦截`delete proxy[propKey]`的操作，返回一个布尔值
- ownKeys(target):拦截 Object.keys(proxy)、for...in 等循环，返回一个数组
- getOwnPropertyDescriptor(target, propKey):拦截`Object.getOwnPropertyDescriptor(proxy,propKey)`，返回属性的描述对象
- defineProperty(target, propKey, propDesc)：拦截`Object.defineProperty(target, propKey, propDesc)`，返回一个布尔值
- preventExtensions(target):拦截`preventExtensions(proxy)`，返回布尔值
- getPrototypeOf(target):拦截`Object.getPrototypeOf(proxy)`，返回一个对象
- isExtensible(target): 拦截`Object.isExtensible(proxy)`，返回一个布尔值
- setPrototypeOf(target,proto): 拦截`Object.setPrototypeOf(proxy,proto)`，返回一个布尔值
- apply(target, object, args):拦截`Proxy`实例作为函数调用的操作
- construct(target, args): 拦截`Proxy`实例作为构造函数调用的操作

#### Reflect

若需要在`Proxy`内部调用对象的默认行为，建议使用`Reflect`，其实是 ES6 中操作对象提供的新`API`

其基本特点：

- 只要`Proxy`对象具有的代理方法，`Reflect`对象全部具有，以静态方法的形式存在
- 修改某些 Object 方法的返回结果，让其变得合理（定义不存在属性行为时不报错而是返回`false`）
- 让`Object`操作都变成函数行为

#### Proxy 的几种用法

- get()

接受三个参数，依次为目标对象、属性名和 proxy 本身，最后一个参数可选

```js
var person = {
  name: '张三',
};
var proxy = new Proxy(person, {
  get: function (target, propKey) {
    return Reflect.get(target, propKey);
  },
});
proxy.name; // "张三"
```

`get`能对数组增删改查进行拦截，下面是读取数组负值的索引

```js
function createArray(...elements) {
  let handler = {
    get(target, propKey, receiver) {
      let index = Number(propKey);
      if (index < 0) {
        propKey = String(target.length + index);
      }
      return Reflect.get(target, propKey, receiver);
    },
  };
  let target = [];
  target.push(...elements);
  return new Proxy(target, handler);
}
let arr = createArray('a', 'b', 'c');
arr[-1]; // c
```

⚠️ 注意：如果一个属性不可配置且不可写，则`proxy`不能修改该属性，否则会报错

```javascript
const target = Object.defineProperties(
  {},
  {
    foo: {
      value: 123,
      writable: false,
      configurable: false,
    },
  }
);
const handler = {
  get(target, propKey) {
    return 'abc';
  },
};
const proxy = new Proxy(target, handler);
proxy.foo;
// TypeError: Invariant check failed
```

- set()

用来拦截某个属性的赋值操作，可以接受四个参数：依次为目标对象、属性名、属性值和 Proxy 本身

假设`Person`对象有一个 age 属性，该属性应该是一个不大于 200 的整数，那么可以使用 Proxy 保证 age 的属性值符合要求

```js
let validator = {
  set: function (obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }
    // 对于满足条件的age属性以及其他属性，会直接保存
    obj[prop] = value;
  },
};
let person = new Proxy({}, validator);
person.age = 100;
person.age; // 100
person.age = 'young'; // 报错
person.age = 300; // 报错
```

如果目标对象自身的某个属性，不可写且不可配置，那么`set`方法将不起作用

```javascript
const obj = {};
Object.defineProperty(obj, 'foo', {
  value: 'bar',
  writable: false,
});
const handler = {
  set: function (obj, prop, value, receiver) {
    obj[prop] = 'baz';
  },
};
const proxy = new Proxy(obj, handler);
proxy.foo = 'baz';
proxy.foo; // "bar"
```

在严格模式下，`set` 代理如果没有返回`true`，就会报错

```javascript
'use strict';
const handler = {
  set: function (obj, prop, value, receiver) {
    obj[prop] = receiver;
    // 无论有没有下面这一行，都会报错
    return false;
  },
};
const proxy = new Proxy({}, handler);
proxy.foo = 'bar';
// TypeError: 'set' on proxy: trap returned falsish for property 'foo'
```

- deleteProperty()

用于拦截 `delete`操作，如果这个方法抛出错误或者返回`false`，当前属性就无法被删除

```javascript
var handler = {
  deleteProperty(target, key) {
    invariant(key, 'delete');
    Reflect.deleteProperty(target, key);
    return true;
  },
};

function invariant(key, action) {
  if (key[0] == '_') {
    throw new Error('无法删除私有属性');
  }
}

var target = { _prop: 'foo' };
var proxy = new Proxy(target, handler);
delete proxy._prop;
// Error:无法删除私有属性
```

⚠️ 注意：目标对象自身的不可配置（configurable）的属性，不能被`deleteProperty`方法删除，否则报错

- revocable()

用于取消代理

```js
Proxy.revocable(target, handler);
```

### 使用场景：

`Proxy`其功能非常类似于设计模式中的代理模式，常用功能如下：

- 拦截和监视外部对象的访问
- 降低函数或类的复杂度
- 在复杂操作前对操作进行校验或对所需资源进行管理

使用 Proxy 保障数据类型的准确性

```js
let numericDataStore = { count: 0, amount: 1234, total: 14 };
numericDataStore = new Proxy(numericDataStore, {
  set(target, key, value, proxy) {
    if (typeof value !== 'number') {
      throw Error('属性只能是 number 类型');
    }
    return Reflect.set(target, key, value, proxy);
  },
});
numericDataStore.count = 'foo';
// Error: 属性只能是 number 类型
numericDataStore.count = 333;
```

声明了一个私有`apiKey`，便于 api 这个对象内部的方法调用，但是不希望从外部也能访问 api\apiKey

```js
let api = {
  _apiKey: '123abc456def',
  getUsers: function () {},
  getUser: function (userId) {},
  setUser: function (userId, config) {},
};
const RESTRICTED = ['_apiKey'];
api = new Proxy(api, {
  get(target, key, proxy) {
    if (RESTRICTED.indexOf(key) > -1) {
      throw Error(`${key} 不可访问.`);
    }
    return Reflect.get(target, key, proxy);
  },
  set(target, key, value, proxy) {
    if (RESTRICTED.indexOf(key) > -1) {
      throw Error(`${key} 不可修改`);
    }
    return Reflect.get(target, key, value, proxy);
  },
});
console.log(api._apiKey);
api._apiKey = '987654321';
```

还能通过使用 Proxy 实现观察者模式

观察者模式指的是函数自动观察数据对象，一旦对象发生改变，函数就会自动执行`observable`函数返回一个原始对象的 Proxy 代理，拦截赋值操作，触发充当观察者的各个函数

```javascript
const queuedObservers = new Set();
const observe = (fn) => queuedObservers.add(fn);
const observable = (obj) => new Proxy(obj, { set });
function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queuedObservers.forEach((observer) => observer());
  return result;
}
```

观察者函数都放进 Set 集合，当修改 obj 的值，都会 set 函数中拦截，自动执行 Set 所有的观察者

## 理解 ES6 中 Decorator 的？有哪些使用场景呢？

### 是什么？

`Decorator` 即装饰器
简单来说，装饰者模式就是一种在不改变原类和使用继承的情况下，动态地扩展对象功能的设计理论。
`ES6`中`Decorator`功能亦是如此，其本质也不是什么高大上的结构，就是一个普通的函数，用于扩展类属性和类方法

这里定义一个士兵，这时他什么装备都没有

```js
class soldier {}
```

定义一个得到 AK 装备的函数，即装饰器

```js
function strong(target) {
  target.AK = true;
}
```

使用该装饰器对士兵进行增强

```js
@strong
class soldier {}
```

这时候士兵就有武器了

```js
soldier.AK;
```

上述代码虽然简单，但是也能够清晰看到了使用`Decorator`的两大优点了：

- 代码可读性变强了，装饰器命名相当于一个注释
- 在不改变原有代码情况下，对原来功能进行扩展

### 如何使用？
