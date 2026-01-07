import express from 'express';
import path from 'path';
import { PORT } from './utils/env-util';
import { publicRouter } from './routes/public-api';
import { privateRouter } from './routes/private-api';
import { errorMiddleware } from './middlewares/error-middleware';

const app = express();

app.use(express.json());

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use("/api", publicRouter)
app.use("/api", privateRouter);
app.use(errorMiddleware);

app.listen(PORT, "0.0.0.0", () => {
    console.log('connected!!');
    console.log(`Server running on port ${PORT}`)
});
