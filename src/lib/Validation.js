
// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
// Removed warnings by un-escaping [ when inside of a character class.
// It is a useless escape, since we've already entered a class.
export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

