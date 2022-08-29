export const ALERT_POP = 'alert/pop';

export const alert = (message) => ({
  type: ALERT_POP,
  message,
});

export default { ALERT_POP, alert };
