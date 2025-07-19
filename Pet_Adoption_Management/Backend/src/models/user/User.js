import { DataTypes } from "sequelize";
import { sequelize } from "../../database/index.js";

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id',
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'username',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'email',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password',
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "admin",
    field: 'role',
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'first_name',
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'last_name',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'phone_number',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'location',
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'address',
  },
  agreeToTerms: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: 'agree_to_terms',
  },
  reset_token: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'reset_token',
  },
  reset_token_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'reset_token_expiry',
  },
  image_path: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'image_path',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
}, {
  tableName: 'users',
  timestamps: false,
});