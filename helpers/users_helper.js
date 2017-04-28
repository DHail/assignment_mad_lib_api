const UsersHelper = {};

UsersHelper.usersPath = () => `/users`;
UsersHelper.userPath = () => `/users/show`;
UsersHelper.newUserPath = () => `/users/new`;
UsersHelper.editUserPath = () => `/users/edit`;
UsersHelper.destroyUserPath = () => `/users?_method=delete`;
UsersHelper.updateUserPath = () => `/users?_method=put`;

module.exports = UsersHelper;
