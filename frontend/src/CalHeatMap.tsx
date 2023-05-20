import CalHeatmap from "cal-heatmap";
import { FC, useEffect } from "react";
import 'cal-heatmap/cal-heatmap.css';
import { useFetch } from "./useFetch";
interface ICalHeatMapProps {};

export const CalHeatMap: FC<ICalHeatMapProps> = () => {
    const { data, error } = useFetch(`http://localhost:8080/jobs/calendar/madrid`);

    useEffect(() => { 
      const cal = new CalHeatmap();
      cal.paint({
          data: {
            source: data,
            x: 'date',
            y: 'value'
          },
          range: 4,
          domain: {
            type: 'month',
            padding: [10, 10, 10, 10],
            label: { position: 'top' },
          },
          subDomain: {
            type: 'xDay',
          },
          scale: {
            color: {
              type: 'linear',
              domain: [0, 10, 100, 500],
              scheme: 'Blues',
            },
          },
          itemSelector: '.calendar',
        });

        return () => {
          cal.destroy();
        }
      }, [data]);

    return (
        <div className="CalHeatMap">
            <h1>{ !error && "This calendar is so epic!!" }</h1>
            <h1>{ error && "There was an error with the calendar" }</h1>
            { !error && (<div className="calendar" />) }
        </div>
    );
}
