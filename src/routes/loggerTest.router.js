import { Router } from "express";
import toAsyncRouter from "async-express-decorator";

const router = toAsyncRouter(Router());

router.get("/", (req, res) => {
  req.logger.fatal("Fatal");
  req.logger.error("Error");
  req.logger.warn("Warning");
  req.logger.info("Info");
  req.logger.http("HTTP");
  req.logger.debug("Debug");

  res.status(200).send("Logger test success");
});

export default router;
