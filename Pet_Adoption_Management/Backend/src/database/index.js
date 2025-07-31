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

export const db = async () => {
  try {
    console.log("Attempting to connect to database...");
    console.log("DB Config:", {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD ? "***" : "NOT SET"
    });
    
    await sequelize.authenticate();
    console.log("Database authentication successful");
    
    await sequelize.sync({alter:true});
    console.log("Database is successfully connected and synced");

  } catch (e) {
    console.error("Database connection failed:", e);
    throw e;
  }
}



