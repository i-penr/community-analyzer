import CalHeatmap from "cal-heatmap";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useFetch } from "./customHooks/useFetch";
import { IWidgets } from "./interfaces/IWidgets";
import './css/calendar.css';
import 'cal-heatmap/cal-heatmap.css';

export const CalHeatMap: FC<IWidgets> = ({ sub }) => {
    const { data, error }: any = useFetch(`http://localhost:8080/widget/calendar/${sub}`);
    const currentDate = useMemo(() => {
      return new Date();
    }, []);
    const [month, setMonth] = useState(currentDate.getMonth());
    const [year, setYear] = useState(currentDate.getFullYear()); 
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const cal = useRef(null as any);

    const years = useMemo(() => {
      let y = [];

      for (let i = new Date().getFullYear(); i > 2005; i--) {
        y.push(i);
      }
      return y;
    }, []);
  
    function handleYearSelectorChange(e: any) {
      e.preventDefault();
      setYear(e.target.value);
      cal.current.jumpTo(new Date().setFullYear(e.target.value), true);
    }

    function handleMonthSelectorChange(e: any) {
      e.preventDefault();
      setMonth(e.target.value);
      cal.current.jumpTo(new Date().setMonth(e.target.value), true);
    }

    function decrementMonth(e: any) {
      e.preventDefault();
      if (month === 0) 
        setYear(year-1);
      setMonth((month-1+12) % 12); 
      cal.current.previous(); 
    }

    function incrementMonth(e: any) {
      e.preventDefault(); 
      if (month === 11)
        setYear(year+1);
      setMonth((month+1+12) % 12); 
      cal.current.next();
    }

    useEffect(() => {
      cal.current = new CalHeatmap();
      const currentCal = cal.current;

      currentCal.paint({
          data: {
            source: data.data,
            x: 'date',
            y: 'value'
          },
          range: 4,
          domain: {
            type: 'month',
            padding: [10, 10, 10, 10],
            label: { 
                position: 'top'
            },
          },
          subDomain: {
            type: 'xDay', radius: 2, width: 23, height: 23, label: 'D'
          },
          scale: {
            color: {
              type: 'linear',
              domain: [0, 10, 100, 500],
              scheme: 'Blues',
            },
          },
          date: { start: currentDate, locale: { weekStart: 1 } },
          itemSelector: '.calendar',
        });

        return () => {
          currentCal.destroy();
        }
      }, [cal, currentDate, data]);

    return (
        <div className="CalHeatMap">
            { error && <div>{ error.message }</div> }

            { !error && data.data &&
            (
            <>
            <span className="px-2 my-2">month:</span>
            <select className="month form-select w-auto d-inline" value={month} name="month" onChange={(e) => handleMonthSelectorChange(e)} required>
              {months.map((m, index) => (
                <option key={m} value={index}>{m}</option>
              ))}
            </select>
            <span className="px-2 my-2">year:</span>
            <select className="year form-select w-auto d-inline" value={year} name="year" onChange={(e) => handleYearSelectorChange(e)} required>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <div className="calendar" />
            <div className="pages">
              <button 
                className="prev btn my-1" 
                onClick={ (e) => { 
                  decrementMonth(e)
                } }>
                ← Previous
              </button>
              <button 
                className="next btn my-1" 
                onClick={ (e) => { 
                  incrementMonth(e);
                     
                } }>
                Next →
              </button>
            </div>
            </>)}
        </div>
    );
}
