const sequelize = require('./db')
const { DataTypes } = require('sequelize')

const User =sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true },
    chatId: { type: DataTypes.INTEGER, unique: true, defaultValue: 0 },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    userName: { type: DataTypes.STRING, unique: true },
    needTech: { type: DataTypes.STRING },
    workBook: { type: DataTypes.STRING },
    needWorkBook: { type: DataTypes.STRING },
    order: { type: DataTypes.STRING },
    admin: { type: DataTypes.BOOLEAN, defaultValue: false }
})

module.exports = User