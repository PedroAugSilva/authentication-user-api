import fastify from "fastify";
import { userRoutes } from "./routes";

const app = fastify();

app.register(userRoutes);
app
  .listen({
    port: 3333,
  })
  .then(() => console.log("Server running in port: 3333"));
