import { app } from './app';
import conn from './db';

conn.connectToDb((err) => {
    if (!err) {
        console.log('Connected to MongoDB');
        
        app.listen(8080, () => {
            console.log('Listening to port 8080');
        });
    }
});