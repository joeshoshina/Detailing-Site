import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";

// Serves the Vercel functions in api/ during `npm run dev`, so the gallery
// works locally without the Vercel CLI. Production uses Vercel's own runtime.
function vercelApiDev() {
  const apiDir = path.resolve("api");

  return {
    name: "vercel-api-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api", async (req, res, next) => {
        const { pathname } = new URL(req.url, "http://localhost");
        const file = path.join(apiDir, `${pathname}.js`);
        const isPrivate = pathname.split("/").some((part) => /^[_.]/.test(part));

        if (isPrivate || !file.startsWith(apiDir) || !fs.existsSync(file)) {
          return next();
        }

        try {
          const handler = (await server.ssrLoadModule(file))[req.method];
          if (!handler) {
            res.statusCode = 405;
            return res.end();
          }

          const url = new URL(req.originalUrl, `http://${req.headers.host}`);
          const response = await handler(
            new Request(url, { method: req.method, headers: req.headers }),
          );

          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          next(err);
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Expose .env / .env.local to the api/ handlers (which read process.env).
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [tailwindcss(), react(), vercelApiDev()],
  };
});
