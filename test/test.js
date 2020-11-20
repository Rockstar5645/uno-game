'use strict'

const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('postgres://akhil:apples@192.168.1.102:5432/uno', {logging: false}); 

class User extends Model {}

(async ()=> {

User.init({
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
    // allowNull defaults to true
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  tableName: 'users'    // make it lowercase 
});

await User.sync({ force: true });

const users = await User.bulkCreate([
  {firstName: 'akhil', lastName: 'gandu'},
  {firstName: 'john', lastName: 'nash'},
  {firstName: 'harold', lastName: 'ford'},
]); 

console.log(users); 

})(); 


  
