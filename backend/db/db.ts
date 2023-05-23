import { Callback, Db, MongoClient } from 'mongodb';

let conn: Db;

const connObj = {
    connectToDb(cb: Callback) {
        MongoClient.connect('mongodb://comm-db:27017/community-analyzer-db')
            .then((client) => {
                conn = client.db();
                createIndexes();
                return cb();
            })
            .catch((err) => {
                console.error(err);
                return cb(err);
            });

        function createIndexes() {
            conn.collection('posts').createIndex({ id: 1 }, { unique: true });
            conn.collection('posts').createIndex({ subreddit: 1 }, { collation: { locale: 'en', strength: 2 } });
            conn.collection('subs').createIndex({ id: 1 }, { unique: true });
            conn.collection('subs').createIndex({ subreddit: 1 }, { collation: { locale: 'en', strength: 2 } });
            conn.collection('keywords').createIndex({ subreddit: 1}, { collation: { locale: 'en', strength: 2 }});
            conn.collection('heatmaps').createIndex({ subreddit: 1}, { collation: { locale: 'en', strength: 2 }});
        }
    },
    getDb() { return conn; }
}


export default connObj;