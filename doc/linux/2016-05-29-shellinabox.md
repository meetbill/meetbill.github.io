## Shell In A Box

免责声明: shellinabox不是SSH客户端或任何安全软件。它仅仅是一个应用程序，能够通过Web浏览器模拟一个远程系统的Shell。同时，它和SSH没有任何关系。这不是可靠的安全地远程控制您的系统的方式。这只是迄今为止最简单的方法之一。无论如何，你都不应该在任何公共网络上运行它。 

### install

安装shellinabox 在Debian / Ubuntu系统上
```
$ sudo apt-get install shellinabox 
```
在RHEL / CentOS系统上
```
# yum install epel-release
# yum install shellinabox
```
### start service

just run
```
 #service shellinabox start 
```
在客户端，打开Web浏览器并导航到： https://ip-address-of-remote-servers:4200 

默认情况下，系统只允许普通用户登录，不允许root用户登录，使用root登陆的话可以看下面op部分

### config

配置shellinabox 正如我之前提到的，shellinabox侦听端口默认为 4200 

* 在Debian/Ubuntu，配置文件的默认位置是 /etc/default/shellinabox 
* 在RHEL/CentOS/Fedora上，默认位置在 /etc/sysconfig/shellinaboxd 

### op

使用root登陆时，登录程序（通常是"/bin/login"）需要读取"/etc/securetty"文件。它的格式是：列出来的tty设备都是允许登录的，注释掉或是在这个文件中不存在的都是不允许root登录的

使用shellinabox 使用的是pts/X设备，具体的设备可以查看"/var/log/secure"日志

>* tty就是tty，是一个很宽泛的名词，它是Teletype的缩写，如果你指的是/dev/tty，那指当前终端  
>* pts是pesudo tty slave，是伪终端的slave端  
>* console指当前的控制台（或者监视器），比如说你Ctrl+Alt+x，然后echo "123" > /dev/console，123总会显示在你的monitor上。
>* vc是virtual console，也可以理解为虚拟的监视器，当你Ctrl+Alt+x，就会切换到vc x，在/dev下面没有直接对应的设备文件，

将pts/0设备加入到/etc/securetty即可实现root登陆