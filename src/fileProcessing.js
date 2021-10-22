import fs from 'fs'
import path from 'path'
import {isBinary} from 'istextorbinary'

/*
  getAllFiles(dirPath, exclusions, container)
    - dirPath: path of directory to make into a book
    - exclusions: regular expressions to exclude directories and files. 
    - container: Used in file recursion, do not touch yourself
  Returns an array, with strings for filenames and objects for directories. 
    Directory objects are just one item long, with that one item being named the directory name.
*/

const getAllFiles = (dirPath, exclusions, container = []) => {
  if (exclusions.some((exclude) => exclude.test(dirPath))) return

  const files = fs.readdirSync(dirPath)
  files.forEach((file) => {
    const inExclusions = exclusions.some((exclude) =>
      exclude.test(file.toLowerCase()),
    )
    const notText = isBinary(file.toLowerCase())
    if (inExclusions || notText) return
    fs.statSync(dirPath + '/' + file).isDirectory()
      ? container.push({
          [file]: getAllFiles(path.join(dirPath, '/', file), exclusions, []),
        })
      : container.push(file)
  })
  return container
}

/*
  Converts the nested array returned by getAllFiles into a flat array.
*/

const fileObjToArray = (nested, currentPath = '') => {
  const prefix = currentPath ? currentPath + '/' : currentPath
  // nested = array of items (strings and objects), represents one level of a directory
  const flattened = nested.reduce((prev, curr) => {
    const toAppend =
      typeof curr === 'string'
        ? [path.join(prefix, curr)]
        : fileObjToArray(Object.values(curr)[0], prefix + Object.keys(curr)[0])
    return [...prev, ...toAppend]
  }, [])
  return flattened
}

export {getAllFiles, fileObjToArray}
// // usage examples
// const obj = getAllFiles('../yale-detour', [], [/node_modules/, /\.git/])
// const arr = fileObjToArray(obj, '../yale-detour')
// fs.writeFileSync('obj.json', JSON.stringify(obj))

// fs.writeFileSync('arr.json', JSON.stringify(arr))
