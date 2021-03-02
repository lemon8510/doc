const { readdirSync, statSync, existsSync, mkdirSync, readFileSync, writeFileSync, rmdirSync } = require('fs')
const { resolve, basename, join, dirname } = require('path')
const md = require('marked')
const { render } = require('art-template')
const style = readFileSync(join(__dirname, './tmpl/style.css'), 'utf8')
const highlight = readFileSync(join(__dirname, './lib/highlight.js'), 'utf8')

class Compiler {
  constructor(config) {
    const root = process.cwd()
    this.config = config
    this.root = root
    this.output = resolve(root, config.output)
    this.tree = []
  }

  start() {
    let { config: { file, dir }, root, tree, output } = this
    console.log('\x1B[33m 生成中... \x1b[0m')
    if (file) return this.page()
    this.clear()
    this.getTree(root, tree)
    this.home()
    this.each(dir)
    console.log(`\x1B[32m 完成: ${output} \x1b[0m`)
  }

  getTree(dir, list) {
    if (this.exclude(dir)) return
    let files = readdirSync(dir) || []
    for (let i = 0, l = files.length; i < l; i++) {
      const v = files[i].trim()
      if (this.exclude(v)) continue
      const name = basename(v, '.md')
      const newName = v.replace(/\.(md|MD)$/, '.html')
      const url = join(dir.replace(this.root, ''), newName)
      const d = resolve(dir, v)
      const children = []
      list.push({ name, url, children })
      if (this.isDir(d)) this.getTree(d, children)
    }
  }

  isDir(dir) {
    return statSync(resolve(dir)).isDirectory()
  }

  exclude(dir) {
    const r1 = /\.(\w|\W)+$/.test(dir)
    const r2 = !(/\.(md|MD)$/.test(dir))
    const r3 = dir === basename(this.output)
    return (r1 && r2) || r3 || false
  }

  mk(dir) {
    if (existsSync(dir)) return true
    if (this.mk(dirname(dir))) return !mkdirSync(dir)
  }

  rfs(dir) {
    return readFileSync(dir, 'utf8')
  }

  each(dir) {
    if (/\.(md|MD)$/.test(dir)) return this.doc(dir)
    if (!this.isDir(dir)) return
    const files = readdirSync(dir)
    for (let i = 0, l = files.length; i < l; i++) {
      this.each(resolve(dir, files[i].trim()))
    }
  }

  doc(dir) {
    const { root, tree, config: { title, output } } = this
    const main = md(this.rfs(dir))
    const tmpl = this.rfs(join(__dirname, './tmpl/doc.tmpl'))
    const html = render(tmpl, { main, title, tree, style, highlight })
    const fileName = basename(dir).replace(/\.(md|MD)$/, '.html')
    const op = dirname(dir).replace(root, output)
    this.mk(op)
    writeFileSync(join(op, fileName), html)
  }

  home() {
    const { tree, output } = this
    const tmpl = this.rfs(join(__dirname, './tmpl/home.tmpl'))
    const h =  render(tmpl, { tree, style })
    this.mk(output)
    writeFileSync(join(output, 'index.html'), h)
  }

  page() {
    let { output, root, config: { title, file } } = this
    title = title === '文档' ?  basename(file, '.md') : title
    const main = md(this.rfs(resolve(root, file)))
    const tmpl = this.rfs(join(__dirname, './tmpl/page.tmpl'))
    const html = render(tmpl, { main, title, style, highlight })
    const fileName = basename(file).replace(/\.(md|MD)$/, '.html')
    this.mk(output)
    writeFileSync(join(output, fileName), html)
    console.log(`\x1B[32m 完成：${join(output, fileName)} \x1b[0m`)
  }

  clear() {
    try {
      rmdirSync(this.output, { recursive: true })
    } catch (e) { process.exit() }
  }
}

module.exports = Compiler
