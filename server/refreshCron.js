import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { refreshInstagramToken } from "./refreshToken.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

(async () => {
  try {
    const token = await refreshInstagramToken(true);
    console.log("Token refresh job completed successfully");
    console.log(`Token length: ${token?.length || 0}`);
    process.exit(0);
  } catch (error) {
    console.error("Token refresh job failed:", error.message);
    process.exit(1);
  }
})();
