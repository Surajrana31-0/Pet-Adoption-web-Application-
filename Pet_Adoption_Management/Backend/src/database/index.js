import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    // logging: false// other example mysql,oracle,h2
    // This is sequelize logging
    logging: (msg) => {
      if (msg.toLowerCase().includes('error')) {
        console.error(msg);
      }
    },
  }
);

export const db = () => {
  try {
    sequelize.sync({alter:true})
    console.log("Database is successfully connected")

  } catch (e) {
    console.error("Database is not connected",e)
  }
}



