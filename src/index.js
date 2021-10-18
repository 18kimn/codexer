import {getAllFiles, fileObjToArray} from './fileProcessing.js'
import highlight from './highlighter.js'
import makeTOC from './tableOfContents.js'
import fs from 'fs'
import {basename, resolve} from 'path'

const main = (dirname) => {
  const fileObj = getAllFiles(dirname)
  const fileArray = fileObjToArray(fileObj)
  console.log(fileArray)
  const titlePage = `
<div style="width:100%;height:100%;
display:flex; place-items: center; place-content: center;
text-align: center; 
">
  <h1 style="width: 100%;">${basename(resolve(dirname))}</h1>
</div>
<div style="page-break-after: always;"></div>
  
  `
  const toc = makeTOC(fileObj)
  console.log('toc made')
  const markdown =
    titlePage +
    toc +
    fileArray.map((filename) => highlight(filename, dirname)).join('')
  console.log('markdown made')
  fs.writeFileSync('test.md', markdown, 'utf-8')
}

main('../../work/aemp/evictorbook')

export default main
