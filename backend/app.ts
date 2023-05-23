import express from 'express';
import { postRouter } from './routes/posts';
import { subredditRouter } from './routes/subreddits';
import Arena from 'bull-arena';
import { Queue } from 'bullmq';
import { widgetRouter } from './routes/widgets';
import { mainTaskRouter } from './routes/mainTask';
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
app.use('/widget', widgetRouter);
app.use('/posts', postRouter);
app.use('/subs', subredditRouter);
app.use('/fetch', mainTaskRouter);
app.use('/jobs', jobRouter);

export default app;