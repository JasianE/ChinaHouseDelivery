// index.ts
import express from "express";

import { middleware } from "#middlewares/middlewares.js";
import daysRoutes from "#routes/daysRoutes.js";
import driversRoutes from "#routes/driversRoutes.js";
import healthRoutes from "#routes/healthRoutes.js";
import ordersRoutes from "#routes/ordersRoutes.js";
import restaurantsRoutes from "#routes/restaurantsRoutes.js";
import runsRoutes from "#routes/runsRoutes.js";

const app = express();
const port = process.env.PORT ?? "9001";

app.use(express.json());

app.get("/", middleware);
app.use("/api/health", healthRoutes);
app.use("/api/restaurants", restaurantsRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/days", daysRoutes);
app.use("/api/runs", runsRoutes);
app.use("/api/orders", ordersRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/**
 * TODO:
 * GOAL: Implemenet the plan out optimal map route endpoint given the runs and addresses 
 * This will require
 * - Each driver having a properly formatted address
 * - Each run having an array of orders of addresses that we can access
 * - A way to send this or calculate it to find the total shortest path
 * - An OWNERS model / user that can be used to view the runners --> later
 * - other stuff, lots to do but good to get started
 */
