### 1、[下面代码的输出是什么？]

```js
(() => {
  let x, y;
  try {
    throw new Error();
  } catch (x) {
    (x = 1), (y = 2);
    console.log(x);
  }
  console.log(x);
  console.log(y);
})();
```

**答案**

> 1 undefined 2

**解析**

catch 块接收参数 x。当我们传递参数时，这与变量的 x 不同。这个变量 x 是属于 catch 作用域的。

之后，我们就将这个块级作用域的变量设置为 1，并设置变量 y 的值。现在，我们打印块级作用域的变量 x，他等于 1.

在 catch 块之外，x 仍然是 undefined，而 y 是 2。当我们想在 catch 块之外的打印 x 时，就会返回 undefined。

### 2.「What does this return?」

```js
[...'kelly'];
```

**答案**

> ['k', 'e', 'l', 'l', 'y']

**解析**

字符串是可迭代的。扩展运算符将迭代的每一个字符映射到一个元素。

### 3、「下面输出的是什么?」

```js
const person = { name: 'kelly' };

function sayHi(age) {
  console.log(`${this.name} is ${age}`);
}

sayHi.call(person, 21);
sayHi.bind(person, 21);
```

**答案**

> kelly is 21 funcion

**解析**

使用两者，我们可以传递我们想要 this 关键字引用的对象。但

.call 方法会立即执行！

.bind 方法会返回函数的拷贝值，但带有绑定的上下文。他不会立即执行。

### 4、「单击下面的 html 片段打印的内容是什么?」

```html
<div onClick="console.log('div')">
  <p onClick="console.log('p')">Click here!</p>
</div>
```

**答案**

> p div

**解析**

如果我们点击 p，我们就会看到两个日志：p 和 div。在事件传播期间，有三个阶段：捕获（Capturing）、目标（target）和冒泡（Bubbling）。默认情况下，事件处理程序在冒泡阶段执行（除非将 useCapture 设置为 true）。它从最深的嵌套元素向外延伸。

在**捕获**阶段中，事件从祖先元素向下传播到目标元素。当事件达到**目标**元素后，**冒泡**才开始。

### ⭐⭐⭐ 5、「下面代码的输出是什么?」

```javascript
const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;

console.log(a[b]);
```

**答案**

456

**解析**

对象键自动转换为字符串。我们试图将一个对象设置为对象 a 的键，其值为 123。

但是，当对象自动转换为字符串化时，它变成了[Object object]。 所以我们在这里说的是 a["Object object"] = 123。 然后，我们可以尝试再次做同样的事情。 c 对象同样会发生隐式类型转换。那么，a["Object object"] = 456。

然后，我们打印 a[b]，它实际上是 a["Object object"]。 我们将其设置为 456，因此返回 456。

### 6、「下面代码的输出是什么?」

```js
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

const lydia = new Person('Lydia', 'Hallie');
const sarah = Person('Sarah', 'Smith');

Person.getFullName = function () {
  return `my firstName is ${this.firstName}, my lastName is ${this.lastName}`;
};

console.log(lydia.getFullName());

console.log(lydia);
console.log(sarah);
```

**答案**

> TypeError my firstName is lydia, my lastName is sarah

> Person {firstName: "Lydia", lastName: "Hallie"}

> undefined

**解析**

你不能像常规对象那样，给构造函数添加属性。如果你想一次性给所有实例添加特性，你应该使用原型。因此本例中，使用如下方式：

```javascript
Person.prototype.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};
```

这才会使 member.getFullName() 起作用。为什么这么做有益的？假设我们将这个方法添加到构造函数本身里。也许不是每个 Person 实例都需要这个方法。这将浪费大量内存空间，因为它们仍然具有该属性，这将占用每个实例的内存空间。相反，如果我们只将它添加到原型中，那么它只存在于内存中的一个位置，但是所有实例都可以访问它！

对于 sarah，我们没有使用 new 关键字。当使用 new 时，this 引用我们创建的空对象。当未使用 new 时，this 引用的是「全局对象」（global object）。

我们说 this.firstName 等于 "Sarah"，并且 this.lastName 等于 "Smith"。实际上我们做的是，定义了 global.firstName = 'Sarah' 和 global.lastName = 'Smith'。而 sarah 本身是 undefined。

### 7. **下面代码输出的是什么？**

```js
function checkAge(data) {
  if (data === { age: 18 }) {
    console.log('You are an adult!');
  } else if (data == { age: 18 }) {
    console.log('You are still an adult.');
  } else {
    console.log(`Hmm.. You don't have an age I guess`);
  }
}

checkAge({ age: 18 });
```

**答案**

> Hmm.. You don't have an age I guess

**解析**

在测试相等性时，基本类型通过它们的值（value）进行比较，而对象通过它们的引用（reference）进行比较。JavaScript 检查对象是否具有对内存中相同位置的引用。

题目中我们正在比较的两个对象不是同一个引用：作为参数传递的对象引用的内存位置，与用于判断相等的对象所引用的内存位置并不同。

这也是 { age: 18 } === { age: 18 } 和 { age: 18 } == { age: 18 } 都返回 false 的原因。

### 8.**下面代码输出什么？**

```js
function getAge() {
  'use strict';
  age = 21;
  console.log(age);
}

getAge();
```

**答案**

> ReferenceError

**解析**

使用 "use strict"，你可以确保不会意外地声明全局变量。我们从来没有声明变量 age，因为我们使用 "use strict"，它将抛出一个引用错误。如果我们不使用 "use strict"，它就会工作，因为属性 age 会被添加到全局对象中了，返回 21。

### 9.**(1)依次输出了什么？(2)整个过程中产生了几个执行上下文？**

```js
console.log('global begin:' + i);
var i = 1;
foo(1);
function foo(i) {
  if (i == 4) {
    return; //i=4退出递归循环
  }
  console.log('foo() begin:' + i);
  foo(i + 1); //递归调用，在函数内部调用自己
  console.log('global end:' + i);
}
```

**答案**

> global begin:undefined

> foo() begin:1

> foo() begin:2

> foo() begin:3

> global end:3

> global end:2

> global end:1

**解析**

输出顺序：（最多有 5 个执行上下文）

![](../面试输出题解.jpg)

### 10. **输出什么?**

```js
function a() {}
var a;
console.log(typeof a); // function
```

**答案**

> function

**解析**

先执行变量提升，后执行函数提升 undefined -> function

### 11. **输出是什么？**

```js
if (!(b in window)) {
  var b = 1;
}
console.log(b);
```

**答案**

> undefined

**解析**

变量提升

### 12. **输出的是什么？**

```js
var c = 1;
function c(c) {
  console.log(c);
}
c(2);
```

**答案**

> 报错，c is not a function

**解析**

存在变量提升与函数提升，这代码块的执行顺序为
var c -> function c () -> c=1,
因此，c 是一个变量，值为 1
