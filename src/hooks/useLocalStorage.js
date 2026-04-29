const userLocalStorage = function () {
  function getUser() {
    return localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  }
  function setUser(userObject) {
    localStorage.setItem("user", JSON.stringify(userObject));
  }
  const userValue = getUser();
  return [userValue, setUser];
};
export {userLocalStorage};