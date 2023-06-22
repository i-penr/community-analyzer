import { FC, useState } from "react";
import { useFetch } from "./customHooks/useFetch";
import "./css/home.css";
import { Link } from "react-router-dom";
interface IHomeProps { };

export const Home: FC<IHomeProps> = (props) => {
    const { data: metadata, error }: any = useFetch('http://localhost:8080/metadata');
    const [subredditValue, setSubredditValue] = useState("");

    function handleSubmit(e: any) {
        e.preventDefault();
    }

    return (
        <div className="Home w-50 m-auto text-center p-5">
            <div className="title py-4">
                <h1 className="home">Reddit Community Analyzer</h1>
                <p>A Tool for Automatic Analysis of Subreddit Data</p>
            </div>
            {error && <h1 className="text-center">There was an error</h1>}
            {metadata.numPosts && <div className="metadata py-4 my-4">
                <table className="table table-sm table-borderless">
                    <tr>
                        <th>Total posts</th>
                        <th>Total subreddits</th>
                    </tr>
                    <tr>
                        <td>{metadata.numPosts.toLocaleString()}</td>
                        <td>{metadata.numSubs.toLocaleString()}</td>
                    </tr>
                </table>
            </div>
            }
            <div className="mt-4 pt-4 display-block">
                <h2>View Subreddit Statistics</h2>
            </div>
            <form className="input-group input-group-lg px-3 py-5" onSubmit={(e) => handleSubmit(e)}>
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
                <Link to={`/sub/${subredditValue}`}>
                    <button className="submit btn btn-primary" type="submit">Search Subreddit</button>
                </Link>
            </form>
            <div className="links mt-5">
                <h4>Or check these other links</h4>
                <ul className="m-auto">
                    <li>
                        <Link to={"/searchPosts"}>
                            <div className="link border">
                                <p>Search Posts</p>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/addPost"}>
                            <div className="link border">
                                <p>Archive Post</p>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/subList"}>
                            <div className="link border">
                                <p>Subreddit List</p>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/addSub"}>
                            <div className="link border">
                                <p>Add Subreddit</p>
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="mt-4 pt-4 display-block">
                <h4>Also check the GitHub for more information and instructions for self hosting</h4>
            </div>
            <a
                className="githubButton btn btn-lg btn-primary"
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/i-penr/community-analyzer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-github" viewBox="0 0 20 20">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                Go To GitHub
            </a>
        </div>
    );
}
