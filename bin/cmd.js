#!/usr/bin/env node
const program = require('commander')

program
  .version('1.0.10')
  .option('-v --version', '显示当前版本号')
  .option('-f --file <filename>', '要生成单个HTML的Markdown文件名称')
  .option('-r --dir <directory>', '要生成HTML文档的Markdown文件目录', './')
  .option('-o --output <output>', '文件输出目录', 'dist')
  .option('-t --title <title>', '文档标题', '文档')
  .parse()

const opts = program.opts()
const complier =  require('../src/compiler')
const c = new complier(opts)

if (opts.file || opts.dir) c.start()
