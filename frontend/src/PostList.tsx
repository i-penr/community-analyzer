import { FC } from "react";
interface IPostListProps {
    posts: any;
    page: string;
};

export const PostList: FC<IPostListProps> = ({ posts, page }) => {

    return (
        <div className="PostList w-60 text-center">
            {posts.posts.map((p: any) => (
                <div key={p.id} className="Post container border my-2 py-2 text-start">
                    {p.thumbnail &&
                        <div className="thumbnail d-inline-block p-1">
                            <a href={p.url}>
                                <img src={p.thumbnail}
                                    height={p.thumbnail_height}
                                    width={p.thumbnail_width}
                                    alt=""
                                />
                            </a>
                        </div>
                    }
                    <div className="body d-inline-block m-3">
                        <h5>
                            <a href={`http://reddit.com${p.permalink}`}>{p.title}</a>
                            <span className="domain mx-2">
                                (<a href={`http://reddit.com/r/${p.subreddit}/`}>from r/{p.subreddit}</a>)
                            </span>
                        </h5>
                        <p className="tagline">
                            submitted
                            <time
                                className="live-timestamp"
                                title={new Date(p.created * 1000).toUTCString()}
                                dateTime={new Date().toString()}
                            > {getTimeAgo(p.created)} ago by </time>
                            <a href={`http://reddit.com/u/${p.author}`}>{p.author}</a>
                        </p>
                        <div className="selftext overflow-hidden">
                            <p>{p.selftext}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function getTimeAgo(created: any) {
    const hour = (new Date().getTime() - created * 1000) / 3600000;

    if (hour < 1) {
        console.log(hour * 60)
        return `${Math.round(hour * 60)} minutes`;
    }

    if (hour >= 24) {
        return `${Math.round(hour / 24)} days`;
    }

    return `${Math.round(hour)} ${hour === 1 ? 'hour' : 'hours'}`;
}

