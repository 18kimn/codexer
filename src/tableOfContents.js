/*
  give the file object from fileProcessing/getAllFiles as input, 
  produce a markdown nested numbered list

  This is mostly a recursive solution that adds indentation levels with each 
    recursion. It's wrapped in a function that adds `.join('\n')` on it
    to make the array into a file-writable string
*/
import {makeLink} from './utils.js'

const makeTOCArray = (fileObj, indent = 0, parent = '') => {
  parent = parent ? parent + '/' : ''
  const spaces = Array(indent).fill(' ').join('')
  return fileObj.reduce((prev, curr, index) => {
    const filename = typeof curr === 'string' ? curr : Object.keys(curr)[0]
    const prefix = `${spaces}${index + 1}. `
    const linked = `${prefix}[${filename}](#${makeLink(parent + filename)})`
    const toAdd =
      typeof curr === 'string'
        ? [linked]
        : [
            prefix + filename,
            ...makeTOCArray(
              Object.values(curr)[0],
              indent + 4,
              parent + filename,
            ),
          ]
    return [...prev, ...toAdd]
  }, [])
}

const makeTOC = (fileObj) => {
  const tocArray = makeTOCArray(fileObj)
  return `

<div style="width:100%;text-align:center;">
<a name="toc"><h1>Table of Contents</h1></a></div>

${tocArray.join('\n')}

  `
}

export default makeTOC
