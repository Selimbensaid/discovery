const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Rating', {
    idrating: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    posts_idposts: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Posts',
        key: 'idposts',
      }
    },
    explorer_idexplorer: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Explorers',
        key: 'idexplorer',
      }
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
     allowNull: false,
    },
  });
};
