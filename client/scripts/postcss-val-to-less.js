const varRgx = /^(--)/

module.exports = (sheet) => {
  let lessVars = {}
  const matches = sheet.match(/[(--)$](.*:[^;]*)/g) || []

  matches.forEach((variable) => {
    const definition = variable.split(/:\s*/)
    let value = definition.splice(1).join(':')
    value = value.trim().replace(/^["'](.*)["']$/, '$1')
    lessVars[definition[0].replace(/['"]+/g, '').trim()] = value
  })

  const transformKey = (key) => key.replace(varRgx, '@')

  lessVars = Object.keys(lessVars).reduce((prev, key) => {
    prev[transformKey(key)] = lessVars[key]
    return prev
  }, {})

  return lessVars
}
