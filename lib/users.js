let users = [];

export const addUser = (user) => {
  users.push(user);
};
console.log("User added:", users);
export const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};
export const getUsers = () => users;

console.log("Current Users:", getUsers());