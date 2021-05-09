const PermissionEnum = ["PUBLIC", "FRIENDSONLY", "PRIVATE"];
const Permission = {
  PUBLIC: PermissionEnum[0],
  FRIENDSONLY: PermissionEnum[1],
  PRIVATE: PermissionEnum[2],
  isValid(permission) {
    return PermissionEnum.includes(permission);
  },
};

module.exports = Permission;
