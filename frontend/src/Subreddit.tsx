import { FC } from "react";
import { useParams } from "react-router-dom";
import { CalHeatMap } from "./CalHeatMap";
import { useFetch } from "./customHooks/useFetch";
import { Keywords } from "./Keywords";
import { SubInfo } from "./SubInfo";
import { SubscriberChart } from "./SubscriberChart";
interface ISubredditProps {
    sub: string;
};

export const Subreddit: FC = () => {
    const { sub } = useParams<ISubredditProps>();
    const { data, error }: any = useFetch(`http://localhost:8080/subs/get/${sub}`);

    return (
        <div className="Subreddit">
            { error && <h4 className="text-center py-5">That subreddit does not exist in the database. Go to <a href="/addSub">add a subreddit</a> if you want to add it (if it exists).</h4>}
            { data && !error && <div>
                <h1 className="title w-50 m-auto text-center py-4"><a href={`http://reddit.com/r/${sub}`}>r/{sub}</a> Statistics</h1>
                <div className="SubInfo Widget">
                    <SubInfo sub={sub} />
                </div>
                <div className="SubscriberChart Widget overflow-auto">
                    <h3 className="m-2 text-start">Subscriber Growth</h3>
                    <SubscriberChart sub={sub} />
                </div>
                <div className="CalHeatmap Widget overflow-auto">
                    <h3 className="m-2 text-start">Activity Calendar</h3>
                    <CalHeatMap sub={sub} />
                </div>
                <div className="Keywords Widget">
                    <h3 className="m-2 text-start">Top 50 Keywords</h3>
                    <Keywords sub={sub} />
                </div>
            </div> }
        </div>
    );
}
