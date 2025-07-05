import { app } from "@/app";
import { env } from "@/env";

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log("🚀 HTTP Server Running!");
    console.log(`📍 Local: http://localhost:${env.PORT}`);
    console.log(`📚 Documentation: http://localhost:${env.PORT}/docs`);
  })