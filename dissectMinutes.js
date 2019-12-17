function minutesFile (mdString) {
  if (typeof minutes !== 'string') new Error('Need string')

  let sections = mdString.split('\n## ')
  let header = sections.shift()
  let defaultInfo = getDefaultInfo(header)
  sections = getSectionObjects(sections, defaultInfo)
  return sections
}

function getSectionObjects (sections, context) {
  let retSections = []
  for (let sec of sections) {
    let section = { context }
    section.topic = sec.split('\n', 1)[0]
    section.misc = []
    let subs = sec.split('\n### ')
    for (sub of subs) {
      console.log('SUB:::', sub)
      let subTitle
      [subTitle, sub] = stringShift(sub)
      sub = sub.trim()
      console.log('SubTitle:::', subTitle)
      console.log('SubRest:::', sub)
      switch (subTitle) {
        case 'Discussion:':
          section.discussion = sub
          break
        case 'Decision:':
          section.decision = sub
          break
        case 'Tasks:':
          section.tasks = sub
          break
        default:
          section.misc.push(sub)
      }
      retSections.push(section)
    }
  }
  return retSections
}

function getDefaultInfo (header) {
  let lines = header.split('\n')

  const defaultInfo = {
    date: {
      regEx: /date/g,
      value: null,},
    time: {
      regEx: /time/g,
      value: null,},
    place: {
      regEx: /place/g,
      value: null,},
    cause: {
      regEx: /cause/g,
      value: null,},
  }

  let infoCount = Object.keys(defaultInfo).length
  let elemCount = 0
  while (infoCount > 0 && elemCount < lines.length - 1) {
    // mystic Error: lines.length - 1 = lines.length
    for (let key of Object.keys(defaultInfo)) {
      if (defaultInfo[key].regEx.test(lines[elemCount])) {
        defaultInfo[key].value = lines[elemCount].split(': ')[1].trim()
        infoCount--
      }
      elemCount++
    }
  }

  // ToDo: Solve the date problem
  if (defaultInfo.time.value) {
    switch (defaultInfo.time.value.length) {
      case 2:
        defaultInfo.time.value.length += ':00:00'
      case 5:
        defaultInfo.time.value.length += ':00'
        break
      case 7:
        break
    }
    defaultInfo.date.value += 'T' + defaultInfo.time.value
  }
  defaultInfo.date.value=new Date(defaultInfo.date.value).toISOString()

  return defaultInfo
}

function stringShift (str, delim) {
  delim = delim || '\n'
  let splitIdx = str.indexOf(delim)
  if (splitIdx < 0) return ''
  let one = str.slice(0, splitIdx)
  str = str.slice(splitIdx)
  return [one, str]
}

exports.minutesFile = minutesFile
