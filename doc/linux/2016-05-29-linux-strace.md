## Linux_strace

strace常用来跟踪进程执行时的系统调用和所接收的信号。 在Linux世界，进程不能直接访问硬件设备，当进程需要访问硬件设备(比如读取磁盘文件，接收网络数据等等)时，必须由用户态模式切换至内核态模式，通 过系统调用访问硬件设备。strace可以跟踪到一个进程产生的系统调用,包括参数，返回值，执行消耗的时间。

strace使用参数

```
-p    跟踪指定的进程
-f    跟踪由fork子进程系统调用
-F    尝试跟踪vfork子进程系统调吸入，与-f同时出现时, vfork不被跟踪
-o filename 默认strace将结果输出到stdout。通过-o可以将输出写入到filename文件中
-ff   常与-o选项一起使用，不同进程(子进程)产生的系统调用输出到filename.PID文件
-r    打印每一个系统调用的相对时间
-t    在输出中的每一行前加上时间信息。-tt 时间确定到微秒级。还可以使用-ttt打印相对时间
-v    输出所有系统调用。默认情况下，一些频繁调用的系统调用不会输出
-s    指定每一行输出字符串的长度,默认是32。文件名一直全部输出
-c    统计每种系统调用所执行的时间，调用次数，出错次数。
-e    expr 输出过滤器，通过表达式，可以过滤出掉你不想要输出
```

**这里特别说下strace的-e trace选项**
-e trace=file     跟踪和文件访问相关的调用(参数中有文件名)
-e trace=process  和进程管理相关的调用，比如fork/exec/exit_group
-e trace=network  和网络通信相关的调用，比如socket/sendto/connect
-e trace=signal    信号发送和处理相关，比如kill/sigaction
-e trace=desc  和文件描述符相关，比如write/read/select/epoll等
-e trace=ipc 进程见同学相关，比如shmget等

### stace使用
strace有两种运行模式。
一种是通过它启动要跟踪的进程。用法很简单，在原本的命令前加上strace即可。比如我们要跟踪 "ls -lh /var/log/messages" 这个命令的执行，可以这样：

```
strace ls -lh /var/log/messages
```

另外一种运行模式，是跟踪已经在运行的进程，在不中断进程执行的情况下，理解它在干嘛。 这种情况，给strace传递个-p pid 选项即可。
比如，有个在运行的some_server服务，第一步，查看pid:

```
pidof some_server
17553
```

得到其pid 17553然后就可以用strace跟踪其执行:

```
strace -p 17553
```

完成跟踪时，按ctrl + C 结束strace即可。
应用场景

strace远不止这么强大，你可以善用之，我想你会离不开它的。同时，你还可以联合gdb和ltrace，你的工作会更加高效。
