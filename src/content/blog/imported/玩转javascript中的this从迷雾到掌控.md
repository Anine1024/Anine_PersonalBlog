---
slug: "玩转javascript中的this从迷雾到掌控"
title: "玩转JavaScript中的this：从迷雾到掌控"
date: "2026-06-02"
category: "前端开发"
tags: ["JavaScript", "this"]
excerpt: "深入解析JavaScript中this的五大绑定原则，通过实战代码示例，让你在代码运行前就能准确判断this指向。"
readingTime: 8
featured: false
---

## 引言

在JavaScript的学习之路上，`this` 关键字就像一个神秘的幽灵，时而清晰可见，时而扑朔迷离。许多开发者都曾在一个回调函数中，对着 `this` 的意外指向抓耳挠腮。我们不妨先思考一个问题：如果不用 `this`，我们该如何在函数中访问调用它的对象？

```javascript
// 不使用this的尴尬
function sayName(context) {
  console.log("Hello, I'm " + context.name);
}
var person = { name: "Alice", greet: sayName };
person.greet(person); // 必须手动传入person
```

这种显式传递上下文的方式不仅冗余，而且破坏了API的优雅性。`this` 的出现，正是为了提供一种更简洁的方式来“隐式”传递一个对象引用。然而，它的灵活性也带来了复杂性。本文将带你掌握判断 `this` 指向的五大原则，从此在代码运行之前就能胸有成竹。

## 核心原则一：默认绑定——独立函数调用

当函数以最普通、最直接的方式被调用时，也就是不带任何修饰符，`this` 指向全局对象（在浏览器中是 `window`，在Node.js中是 `global`）。在严格模式下（`"use strict"`），`this` 则为 `undefined`。

```javascript
function showThis() {
  console.log(this); // 浏览器中输出 window
}
showThis(); // 独立函数调用

// 严格模式下的表现
function showThisStrict() {
  "use strict";
  console.log(this); // undefined
}
showThisStrict();
```

这个规则是所有规则中最基础、最简单的。但要注意，即使函数被嵌套在其他函数中，只要它是以独立函数的形式被调用，`this` 依然遵循默认绑定。

```javascript
var name = "Global";
function outer() {
  function inner() {
    console.log(this.name); // 输出 "Global"（非严格模式）
  }
  inner(); // 独立调用，this指向全局
}
outer();
```

## 核心原则二：隐式绑定——调用者决定一切

这是最常用也最容易出错的规则。当函数作为某个对象的方法被调用时，`this` 指向调用该方法的对象。简单来说，“谁调用了它，它就指向谁”。

```javascript
function greet() {
  console.log(this.name);
}

var person1 = { name: "Alice", greet: greet };
var person2 = { name: "Bob", greet: greet };

person1.greet(); // Alice
person2.greet(); // Bob
```

然而，隐式绑定有一个常见的陷阱：**引用丢失**。当我们把方法赋值给一个变量，或者作为参数传递时，它就会失去原来的上下文。

```javascript
var person = {
  name: "Charlie",
  greet: function() {
    console.log(this.name);
  }
};

var myGreet = person.greet; // 这里只是拿到了函数的引用
myGreet(); // undefined（非严格模式）或报错（严格模式）
// 因为此时myGreet是独立调用，this指向全局/undefined
```

更隐蔽的情况发生在回调函数中：

```javascript
var person = {
  name: "David",
  greet: function() {
    setTimeout(function() {
      console.log(this.name); // undefined
    }, 100);
  }
};
person.greet(); // 回调函数是独立调用，this丢失
```

## 核心原则三：显式绑定——手动指定this

JavaScript 提供了三个方法让我们手动指定 `this` 的指向：`call`、`apply` 和 `bind`。它们就像是给函数安装了一个“遥控器”，你指哪它就打哪。

```javascript
function introduce(age, city) {
  console.log(`I'm ${this.name}, ${age} years old, from ${city}`);
}

var person = { name: "Eve" };

// call：参数逐个传入
introduce.call(person, 25, "Beijing");

// apply：参数以数组形式传入
introduce.apply(person, [30, "Shanghai"]);

// bind：返回一个新函数，永久绑定this
var boundIntroduce = introduce.bind(person, 28, "Guangzhou");
boundIntroduce(); // I'm Eve, 28 years old, from Guangzhou
```

`bind` 的强大之处在于，它创建的新函数，其 `this` 指向无法再被 `call`、`apply` 或后续的 `bind` 改变。这解决了隐式绑定中回调函数丢失上下文的问题：

```javascript
var person = {
  name: "Frank",
  greet: function() {
    setTimeout(function() {
      console.log(this.name); // Frank
    }.bind(this), 100); // 这里的this指向person
  }
};
person.greet();
```

## 核心原则四：new绑定——构造函数的特权

当使用 `new` 关键字调用函数时，JavaScript 会创建一个全新的对象，并将这个新对象作为 `this` 绑定到函数中。这是 `this` 优先级最高的绑定方式之一。

```javascript
function Person(name) {
  // var this = {};  // 引擎内部自动创建
  this.name = name;
  // this.__proto__ = Person.prototype;
  // return this;
}

var alice = new Person("Alice");
console.log(alice.name); // Alice
```

如果构造函数中返回了一个对象，那么 `this` 会被丢弃，转而返回那个对象；如果返回的是基本类型，则忽略返回值，继续返回 `this`。

```javascript
function SpecialPerson(name) {
  this.name = name;
  return { custom: "object" }; // 返回对象
}

var result = new SpecialPerson("Bob");
console.log(result.name); // undefined
console.log(result.custom); // "object"
```

## 核心原则五：箭头函数——词法作用域的胜利

ES6 引入的箭头函数彻底打破了上述四条规则。箭头函数没有自己的 `this`，它捕获的是**定义时**所在作用域的 `this` 值，而不是执行时的 `this`。这就像是一个时间胶囊，保存了函数创建那一刻的上下文。

```javascript
var person = {
  name: "Grace",
  greet: function() {
    // 传统函数
    setTimeout(function() {
      console.log(this.name); // undefined
    }, 100);

    // 箭头函数
    setTimeout(() => {
      console.log(this.name); // Grace
    }, 100);
  }
};
person.greet();
```

箭头函数的 `this` 不可被 `call`、`apply`、`bind` 改变：

```javascript
var arrow = () => console.log(this.name);
var obj = { name: "Hank" };
arrow.call(obj); // undefined（如果全局没有name）
// 箭头函数的this始终指向定义时所在的作用域（此处为全局）
```

## 实战：五大原则的优先级

当多种规则同时适用时，优先级顺序为：**new绑定 > 显式绑定 > 隐式绑定 > 默认绑定**。箭头函数不参与这个优先级排序，它独立于这套体系。

```javascript
function foo() {
  console.log(this.name);
}

var obj1 = { name: "obj1", foo: foo };
var obj2 = { name: "obj2" };

// 隐式绑定 vs 显式绑定
obj1.foo.call(obj2); // obj2（显式绑定胜出）

// new绑定 vs 显式绑定
var boundFoo = foo.bind(obj1);
new boundFoo(); // undefined（new绑定胜出，但this指向新对象，新对象没有name属性）
```

## 总结

掌握 `this` 的指向，关键在于理解函数调用的方式：

- **默认绑定**：独立函数调用，指向全局（非严格模式）或 `undefined`（严格模式）。
- **隐式绑定**：作为对象方法调用，指向调用该方法的对象。小心引用丢失。
- **显式绑定**：使用 `call`/`apply`/`bind` 手动指定 `this`。
- **new绑定**：使用 `new` 调用，`this` 指向新创建的对象。
- **箭头函数**：不遵循以上规则，`this` 由定义时的外层作用域决定。

在实际开发中，最常遇到的坑是回调函数中的 `this` 丢失。解决方案有三种：使用箭头函数、使用 `bind` 绑定、或者在外层保存 `this` 引用（`var self = this`）。理解这五大原则，你就能在代码运行之前，准确地预测 `this` 的指向，从此告别“`this` 迷雾”。