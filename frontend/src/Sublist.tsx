import { FC, useEffect, useState } from "react";
import { useFetch } from "./customHooks/useFetch";
import "./css/sublist.css"
import { Link } from "react-router-dom";
interface ISublistProps { };

export const Sublist: FC<ISublistProps> = (props) => {
    const { data: subList, error }: any = useFetch('http://localhost:8080/jobs/getAll');
    const [inputValue, setInputValue] = useState('');
    const [foundList, setFoundList] = useState([]);

    useEffect(() => {
        setFoundList(subList)

        return () => {
            setFoundList(subList);
        }
    }, [subList]);

    function getColor(status: string) {
        return status === 'available' ? "green" : "red";
    }

    function filter(search: string) {
        const searchResult = subList.filter((job:any) => {
            return job.sub.toLowerCase().startsWith(search.toLowerCase());
        });

        setFoundList(searchResult);
        setInputValue(search);
    }

    return (
        <div className="Sublist">
            { error && <p>There was an error with the database</p>}
            <div className="input input-group input-group-lg">
                <input 
                    className="form-control"
                    placeholder="Search Subreddits"
                    maxLength={30}
                    value={inputValue}
                    onChange={(e) => filter(e.target.value) }
                />
            </div>

            <hr />

            { foundList.length === 0 && 
              <p>There is no register of "{ inputValue }". Try <Link to={`/sub/${inputValue}`}>adding it</Link>.</p>
            }
            { foundList && foundList.map((job: any) => (
                <div className="sub-container">
                    <Link to={`/sub/${job.sub}`}>
                        <div className="sub border border-primary rounded">
                            <h3 className="sub-title">r/{job.sub}</h3>
                            <span className="corner fw-bold" style={{ color: getColor(job.status) }}>{job.status}</span>
                            <span className="bottom-left">Last updated in: {new Date(job.lastUpdated).toLocaleString()}</span>
                        </div>
                    </Link>
                </div>

            ))}
        </div>
    );
}
