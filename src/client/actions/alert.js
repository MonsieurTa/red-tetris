export const ALERT_POP = 'alert/pop'

export const alert = (message) => {
  return {
    type: ALERT_POP,
    message
  }
}

