export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRegister = ({ name, email, password }) => {
  const errors = {};

  if (!name) errors.name = "Name is required";

  if (!email) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (!validatePassword(password)) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

export const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!email) errors.email = "Email is required";
  else if (!validateEmail(email)) errors.email = "Invalid email";

  if (!password) errors.password = "Password is required";
  else if (!validatePassword(password)) errors.password = "Password must be at least 6 characters"; 

  return errors;
};