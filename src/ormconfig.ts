import { ConnectionOptions } from "typeorm";

export default {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "pengins",
  synchronize: true,
  logging: false,
  entities: [
    `./${process.env.BUILD ? "bin" : "src"}/entity/*.${
      process.env.BUILD ? "js" : "ts"
    }`,
  ],
  cli: {
    entitiesDir: `./${process.env.BUILD ? "bin" : "src"}/entity`,
  },
} as ConnectionOptions;
