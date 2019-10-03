import Notification from './notification'

let msgInstance

function getMsgInstance () {
  msgInstance = msgInstance || Notification.newInstance()
  return msgInstance
}

function notice ({duration = 1.5, content = ''}) {
  let instance = getMsgInstance()

  instance.add({
    content,
    duration
  })
}

export default {
  info (options) {
    return notice(options)
  }
}