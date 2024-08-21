const describeFile = ({ dirPath, fileName }) => {
  let desc = 'file'
  if (fileName !== undefined && dirPath !== undefined) {
    // this is not super robust and fails with a relative path that's just 'a-dir', but we want to avoid bloating the
    // package with anything fancier.
    const sep = dirPath.includes('\\') ? '\\' : '/'
    desc += dirPath.endsWith(sep) ? ` '${dirPath}${fileName}'` : ` '${dirPath}${sep}${fileName}'`
  }
  else if (fileName !== undefined) {
    desc += ` '${fileName}'`
  }
  else if (dirPath !== undefined) {
    desc = `a file in directory '${dirPath}'`
  } // else

  return desc
}

export { describeFile }
