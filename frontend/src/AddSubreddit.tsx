import { FC, useEffect, useState } from "react";
interface IAddSubreddit { };

export const AddSubreddit: FC<IAddSubreddit> = (props) => {
    const [subredditValue, setSubredditValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null as any);
    const [result, setResult] = useState(null as any);
    const [numJobs, setNumJobs] = useState(0);

    function handleSubmit(e: any) {
        e.preventDefault();
        setIsLoading(true);
        setNumJobs(prevNumJobs => prevNumJobs + 1);

        fetch(`http://localhost:8080/fetch/${subredditValue}`,
            { method: 'POST' })
            .then((res) => {
                if (res.status >= 500) {
                    throw Error('There was an error in the request', { cause: res });
                }

                return res.json();
            })
            .then((data) => {
                setResult(data);
                setError(null);
            }).catch((err) => {
                console.log(err)
                if (err.name !== 'AbortError')
                    setError(err);
            }).finally(() => {
                setNumJobs(prevNumJobs => prevNumJobs - 1);
            });
    }

    useEffect(() => {
        setIsLoading(numJobs > 0); // Update isLoading based on numJobs
    }, [numJobs]);


    return (
        <div className="AddPost w-50 p-5 my-5 text-center mx-auto">
            <h1>Add Subreddit</h1>
            <p className="p-4 text-start">
                Here you can upload a subreddit to our database. Aproximately the last 1000 posts
                of that subreddit will begin downloading (that is Reddit's maximum limit) and
                with that data statistics will start being generated. You can also manually
                request an update from here.
            </p>
            <p className="px-4 text-start">
                This process takes normally about 30 seconds, depending on the subreddit and the
                amount of data. You can also add several subreddits while other is still
                uploading.
            </p>
            <p className="px-4 text-start">
                You will only need to input the subreddit name below.
            </p>

            <form className="input-group input-group-lg p-3" onSubmit={(e) => handleSubmit(e)}>
                <span className="input-group-prepend input-group-text">
                    r/
                </span>
                <input
                    className="form-control"
                    placeholder="Subreddit"
                    aria-label="Large"
                    aria-describedby="inputGroup-sizing-sm"
                    value={subredditValue}
                    onChange={(e) => setSubredditValue(e.target.value)}
                />
                <button className="submit btn btn-primary" type="submit">Add Subreddit</button>
            </form>
            {result &&
                <p
                    style={{ color: `${result.statusCode === 200 ? 'green' : 'red'}` }}>
                    {result.msg}
                </p>}
            { isLoading &&
                <div>
                    Uploading data... (Jobs left {numJobs})
                </div>}
            {error && <h6 className="text-center" style={{ color: "red" }}>There was an error with the request</h6>}
            <div className="p-5">
                <h6>
                    If you would like to see the list of registered subreddits,
                    check out the <a href="/subList">subreddit list</a>
                </h6>
            </div>
        </div>
    );
}
