## AngularJS

AngularJS 路由允许我们通过不同的 URL 访问不同的内容。
通过 AngularJS 可以实现多视图的单页Web应用（single page web application，SPA）。

通常我们的URL形式为 http://xxxxx/first/page，但在单页Web应用中 AngularJS 通过# + 标记 实现，

例如：
* http://xxxxx/#/first
* http://xxxxx/#/second

当我们点击以上的任意一个链接时，向服务端请的地址都是一样的 (http://xxxxx/)。

 因为 # 号之后的内容在向服务端请求时会被浏览器忽略掉。 所以我们就需要在客户端实现 # 号后面内容的功能实现。 

AngularJS 路由 就通过# + 标记 帮助我们区分不同的逻辑页面并将不同的页面绑定到对应的控制器上。