### linux中向其他用户终端发消息 

用w命令查看都有哪些终端用户
```
#w
```
假如有用户test在线，使用的是pst/3，则可以发送消息
```
#write test pts/3
#hello!
```
