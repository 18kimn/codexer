import fs from 'fs'
import path from 'path'

const getAllFiles = (
  dirPath,
  container = [],
  excludes = [
    /node_modules/,
    /\.git/,
    /\.pdf/,
    /\.lock/,
    /neo4j_data/,
    /package-lock/,
    /\.png/,
    /\.svg/,
    /\.env/,
  ],
) => {
  if (excludes.some((exclude) => exclude.test(dirPath))) return

  const files = fs.readdirSync(dirPath)
  files.forEach((file) => {
    if (excludes.some((exclude) => exclude.test(file))) return
    fs.statSync(dirPath + '/' + file).isDirectory()
      ? container.push({
          [file]: getAllFiles(path.join(dirPath, '/', file), [], excludes),
        })
      : container.push(file)
  })
  return container
}

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
