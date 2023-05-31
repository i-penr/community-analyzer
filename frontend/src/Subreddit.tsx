import { FC } from "react";
import { useParams } from "react-router-dom";
import { CalHeatMap } from "./CalHeatMap";
import { Keywords } from "./Keywords";
interface ISubredditProps {
    sub: string;
};

export const Subreddit: FC = () => {
    const { sub } = useParams<ISubredditProps>();


    return (
        <div className="Subreddit ">
            <h1 className="title">r/{ sub }</h1>
            <div className="Widget overflow-auto">
                <h3 className="m-2 text-start">Activity Calendar</h3>
                <CalHeatMap sub={sub}/>
            </div>
            <div className="Widget">
                <h3 className="m-2 text-start">Top 50 Keywords</h3>
                <Keywords sub={sub} />
            </div>           
        </div>
    );
}
