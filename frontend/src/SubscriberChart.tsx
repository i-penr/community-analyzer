import { FC, useEffect, useState } from "react";
import { IWidget } from "./interfaces/IWidget";
import { useFetch } from "./customHooks/useFetch";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';


export const SubscriberChart: FC<IWidget> = ({ sub }) => {
    const { data: subscribersData, error }: any = useFetch(`http://localhost:8080/widget/subscribers/${sub}`);
    const [maxSubscribers, setMaxSubscribers]: any = useState(0);
    const [minSubscriberes, setMinSubscribers]: any = useState(0);

    useEffect(() => {
        if (subscribersData && subscribersData.data) {
            setMaxSubscribers(Math.max(...subscribersData.data.map((item: any) => item.subscribers)));
            setMinSubscribers(Math.min(...subscribersData.data.map((item: any) => item.subscribers)));
        }
    }, [subscribersData])


    return (
        <div className="SubscriberChart">
            {error && <div>There was an error</div>}

            {subscribersData &&
                (
                    <LineChart width={900} height={400} data={subscribersData.data} margin={{left: 40 }}>
                        <Line type="monotone" dataKey="subscribers" stroke="#3899EC" strokeWidth={3} activeDot={{ r: 8 }} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[minSubscriberes-1000, maxSubscribers+1000]}/>
                        <Tooltip />
                    </LineChart>
                )}
        </div>
    );
}
