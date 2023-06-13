import { FC, useState } from "react";
import "./css/addpost.css";
interface IAddPostProps { };

export const AddPost: FC<IAddPostProps> = (props) => {
    const [selectValue, setSelectValue] = useState('URL');
    const [postId, setPostId] = useState('');
    const [error, setError] = useState(null as any);
    const [result, setResult] = useState(null as any);

    function handleSubmit(e: any) {
        e.preventDefault();

        setResult(null);

        fetch(`http://localhost:8080/posts/${selectValue.toLowerCase()}/${postId}`,
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
                if (err.name !== 'AbortError')
                    setError(err);
            });
    }

    return (
        <div className="AddPost w-50 p-5 my-5 text-center mx-auto">
            <h1 className="title">Add post</h1>
            <div className="infoArea">
                <p className="p-3 text-start">
                    Here you can add posts manually in order to <strong>archive</strong> them and also
                    for them to appear in the statistics page. Just paste the <strong>submission URL </strong>
                    below and it will be submitted to the database.
                </p>
                <p className="px-4 text-start">
                    Here is an example of a valid URL:
                </p>
                <p className="bg-light w-50 py-2 m-auto" style={{ fontFamily: 'Consolas' }}>https://reddit.com/r/subredditName/comments/someId/some_title/</p>
                <p className="px-4 pb-3 pt-5 text-center">
                    You can also use the <strong>post ID</strong> (<i>someId</i> in the example URL)
                </p>
            </div>

            <form className="input-group input-group-lg px-2 py-3" onSubmit={(e) => handleSubmit(e)}>
                <div className="input-group-prepend">
                    <select
                        className="selector input-group-text btn btn-secondary btn-lg"
                        value={selectValue}
                        id="inputGroup-sizing-lg"
                        onChange={(e) => setSelectValue(e.target.value)}
                    >
                        <option value="URL" >URL</option>
                        <option value="ID" >ID</option>
                    </select>
                </div>
                <input
                    className="form-control"
                    placeholder={selectValue === 'URL' ? "https://reddit.com/r/..." : 'ID'}
                    aria-label="Large"
                    aria-describedby="inputGroup-sizing-sm"
                    value={postId}
                    onChange={(e) => setPostId(e.target.value)}
                />
                <button className="submit btn btn-primary" type="submit">Add Post</button>
            </form>
            {result &&
                <p
                    style={{ color: `${result.statusCode === 200 ? 'green' : result.statusCode === 409 ? 'orange' : 'red'}` }}>
                    {result.msg}
                </p>}
            {error && <h6 className="text-center" style={{ color: "red" }}>There was an error with the request</h6>}
        </div>
    );
}
