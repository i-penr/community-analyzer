import express from 'express';
import { postRouter } from './routes/posts';
import { subredditRouter } from './routes/subreddits';
import Arena from 'bull-arena';
import { Queue } from 'bullmq';
import { jobRouter } from './routes/jobs';

export const app = express();

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

const arena = Arena({
    BullMQ: Queue,
    queues: [
        {
            type: 'bullmq',
            name: 'mainQueue',
            hostId: 'server',
            redis: {
                host: 'comm-redis',
                port: 6379
            }
        }
    ]
});

app.use('/arena', arena);

app.use(express.json());
app.use('/jobs', jobRouter);
app.use('/posts', postRouter);
app.use('/subs', subredditRouter);

export default app;