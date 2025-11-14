const {User, Address} = require('../models/index');

module.exports.createUser = async (data) => {
   return await User.create(data)
}

module.exports.findOneUser = async (conditions) => {
    return await User.findOne({
        where: conditions
    });
}

module.exports.updateProfile = async (id, newUserInfor) => {
    const user = await User.findByPk(id);
    if(!user) return null;
    await user.update(newUserInfor);
    return user;
}

module.exports.createAddress = async (data) => {
    return await Address.create(data)
}

module.exports.getUserAddresses = async (userId) => {
    return await Address.findAll({ where: { user_id: userId } });
  };
