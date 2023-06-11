import { FC, useEffect, useState } from "react";
import { IWidget } from "./interfaces/IWidget";
import { useFetch } from "./customHooks/useFetch";
import * as Chartist from "chartist";
import './css/chartist.css';

export const SubscriberChart: FC<IWidget> = ({ sub }) => {
    const { data: subscribersData, error }: any = useFetch(`http://localhost:8080/widget/subscribers/${sub}`);
    const [grouping, setGrouping] = useState('week');


    useEffect(() => {
        if (subscribersData && subscribersData.data) {
            new Chartist.LineChart('.subscribers', {
                labels: subscribersData.data.map((item: any) => item.date),
                series: [subscribersData.data.map((item: any) => item.subscribers)],
            }, {
                fullWidth: true,
                height: 400,
                chartPadding: {
                    right: 20
                },
                axisX: {
                    scaleMinSpace: 20,
                    onlyInteger: true,
                    showGrid: true,
                    stretch: true
                },
                axisY: {
                    offset: 80,
                    labelInterpolationFnc: function (value) {
                        return value.toLocaleString();
                    }
                }
            })
        }
    }, [grouping, subscribersData])


    return (
        <div className="SubscriberChart">
            <select value={grouping} onChange={(e) => setGrouping(e.target.value)}>
                <option value="day">Group by Day</option>
                <option value="week">Group by Week</option>
                <option value="month">Group by Month</option>
            </select>


            {subscribersData && (<div className="subscribers" />)}
        </div>
    );
}
