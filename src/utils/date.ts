const SIGN_REGEXP = /([yMdhsmS])(\1*)/g
const DEFAULT_PATTERN = 'yyyy-MM-dd'
function padding(s: number, len: number): string {
  let ss = `${s}`
  const len2 = len - ss.length
  for (let i = 0; i < len2; i++) {
    ss = `0${ss}`
  }
  return ss
}

export function formatDate(date: Date, pattern?: string) {
  pattern = pattern || DEFAULT_PATTERN
  return pattern.replace(SIGN_REGEXP, ($0): string => {
    switch ($0.charAt(0)) {
      case 'y': {
        return padding(date.getFullYear(), $0.length)
      }
      case 'M': {
        return padding(date.getMonth() + 1, $0.length)
      }
      case 'd': {
        return padding(date.getDate(), $0.length)
      }
      case 'w': {
        return `${date.getDay() + 1}`
      }
      case 'h': {
        return padding(date.getHours(), $0.length)
      }
      case 'm': {
        return padding(date.getMinutes(), $0.length)
      }
      case 's': {
        return padding(date.getSeconds(), $0.length)
      }
      default:
        return ''
    }
  })
}

export function formatDuration(time: number) {
  let str = ''
  const hour = time >= 3600000 ? parseInt(`${time / 3600000}`, 10) : 0
  const minute = time >= 60000 ? parseInt(`${(time % 3600000) / 60000}`, 10) : 0
  const second = time >= 1000 ? parseInt(`${(time % 60000) / 1000}`, 10) : 0

  if (hour > 0) {
    str += `${padding(hour, 2)}:`
  }
  str += `${padding(minute, 2)}:${padding(second, 2)}`
  return str
}
