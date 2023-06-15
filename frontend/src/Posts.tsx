/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { useFetch } from "./customHooks/useFetch";
import "./css/posts.css"
import { PostList } from "./PostList";
interface PostsProps { };

export const Posts: FC<PostsProps> = (props) => {
    const { data: subList, error }: any = useFetch("http://localhost:8080/jobs/getAll");
    const [post, setPost] = useState("");
    const [user, setUser] = useState("");
    const [subreddit, setSubreddit] = useState("Any");
    const [date, setDate] = useState("");
    const [orderBy, setOrderBy] = useState("Latest");
    const [page, setPage] = useState("1");
    const [searchResults, setSearchResults] = useState([] as any);
    const [isLoading, setIsLoading] = useState(false);


    const secondaryFilters = [
        { type: "inputDate", id: "fromDate", label: "Date", value: date, onChange: setDate },
        { type: "input", id: "fromUser", label: "User", span: "u/", value: user, onChange: setUser },
        { type: "select", id: "subredditSelector", label: "Subreddit", span: "r/", value: subreddit, onChange: setSubreddit, options: ["Any"].concat(subList.map((item: any) => item.sub)) },
        { type: "select", id: "orderBySelector", label: "Order By", value: orderBy, onChange: setOrderBy, options: ["Latest", "Oldest", "Title A-Z", "Title Z-A", "Description A-Z", "Description Z-A", "User A-Z", "User Z-A"] }
    ]

    useEffect(() => {
        handleSubmit();
    }, [page])

    function handleSubmit(e?: any) {
        if (e) e.preventDefault();

        const encodedPost = encodeURIComponent(post);
        const queryString = new URLSearchParams({ post: encodedPost, sub: subreddit, date, user, orderBy, page, limit: '10' }).toString();

        setIsLoading(true);

        fetch(`http://localhost:8080/posts/search?${queryString}`)
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data);
            })
            .catch((error) => {
                console.error(error);
            }).finally(() => {
                setIsLoading(false);
            })
    }


    return (
        <div className="Posts">
            {error && "There was an error"}
            {!error && <>
                <h1 className="text-center py-4 my-3">Post Search</h1>
                <p className="PostSearchDesc text-center">
                    Search posts using the filters below. Only the archived posts will appear. It is not necessary to specify a value for all fields.
                </p>
                <div className="inputArea px-5 py-4 my-2">
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <label htmlFor={"searchPosts"}>Post Search</label>
                        <div className="input-group">
                            <input
                                placeholder="Post Search"
                                className="main form-control"
                                id="searchPosts"
                                maxLength={100}
                                value={post}
                                onChange={(e) => setPost(e.target.value)}
                            />
                        </div>

                        {secondaryFilters.map((filter: any) => (
                            <div key={filter.label} className="secondary d-inline-block">
                                <label className="form-label" htmlFor={filter.id}>{filter.label}</label>
                                <div className="d-block">
                                    {filter.span && <span>{filter.span}</span>}
                                    {filter.type.includes("input") &&
                                        <input
                                            className="secondaryInput"
                                            type={filter.type === "input" ? "text" : "date"}
                                            id={filter.id}
                                            placeholder={filter.label}
                                            value={filter.value}
                                            onChange={(e) => filter.onChange(e.target.value)}
                                        />}
                                    {filter.type === "select" &&
                                        <select
                                            className="secondaryInput"
                                            id={filter.id}
                                            value={filter.value}
                                            onChange={(e) => filter.onChange(e.target.value)}
                                        >
                                            {filter.options.map((option: string) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>}
                                </div>
                            </div>
                        ))}
                        <button type="submit" className="btn btn-primary d-block my-2">Apply Filters</button>
                    </form>
                </div>
            </>}
            {isLoading && <div className="text-center">Loading...</div>}
            {searchResults.posts && searchResults.posts.length === 0 && (<div className="text-center">No posts were found</div>)}
            {searchResults.posts && searchResults.posts.length !== 0 &&
                <div className="resultsContainer w-60 text-center">
                    <h6 className="my-4">Total pages: {searchResults.totalPages}</h6>
                    <ul className="d-inline-block">
                        <li className="d-inline-block mx-1">
                            <button
                                className='PageButton'
                                onClick={(e) => { setPage(String(1)) }}
                                disabled={page === '1'}
                            >
                                Start
                            </button>
                        </li>
                        <li className="d-inline-block">
                            <button
                                className='PageButton'
                                onClick={(e) => { setPage(String(Number(page) - 1)) }}
                                disabled={page === '1'}
                            >
                                ← Previous Page
                            </button>
                        </li>
                        <p className="d-inline-block mx-2">Page: {page}</p>
                        <li className="d-inline-block mx-1">
                            <button
                                className='PageButton'
                                onClick={(e) => { setPage(String(Number(page) + 1)) }}
                                disabled={page === String(searchResults.totalPages)}
                            >
                                Next Page →
                            </button>
                        </li>
                        <li className="d-inline-block">
                            <button
                                className='PageButton'
                                onClick={(e) => { setPage(String(searchResults.totalPages)) }}
                                disabled={page === String(searchResults.totalPages)}
                            >
                                End
                            </button>
                        </li>
                    </ul>
                    <PostList posts={searchResults} page={page} />
                </div>
            }
        </div>
    )
}
