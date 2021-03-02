### @nvae/doc

@nvae/doc 是一个命令行工具，用于使用GitHub/Git和Markdown构建漂亮的html文档或博客。

![预览](https://raw.githubusercontent.com/nvae/doc/master/src/assets/img.png)

### 使用说明

#### 使用npm安装： 

```
npm install -g @nvae/doc
```

`@nvae/doc` 是一个markdown转换工具。它将可以通过命令行形式来构建一个html文档或者博客。

#### 使用单个md文件生成html文档：

**doc -f 文件名**

```
doc -f ./name.md
```

#### 使用文件夹生成带菜单的html文档：

+ 默认

 ```
 doc
 ```

+ 指定目录

```
doc -r ./dir
```

#### 设置文档标题

```
doc -t 文档标题
```

#### 设置输出目录

默认： `dist`

```
doc -o build
```

#### 查看帮助

```
doc -h
```

#### 查看版本

```
doc --version
```

### 关于

作者：@nvae

Email: rchdg@qq.com

