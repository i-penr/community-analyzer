import CalHeatmap from "cal-heatmap";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useFetch } from "./customHooks/useFetch";
import { IWidgets } from "./interfaces/IWidgets";
// @ts-ignore
import Tooltip from 'cal-heatmap/plugins/Tooltip';
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

      for (let i = new Date().getFullYear(); i >= 2005; i--) {
        y.push(i);
      }
      return y;
    }, []);

    function decrementMonth(e: any) {
      e.preventDefault();
      if (month === 0 && year === 2005) return; 
      
      if (month === 0)
        setYear(year-1);

      setMonth((month-1+12) % 12); 
      cal.current.previous(); 
    }

    function incrementMonth(e: any) {
      e.preventDefault();

      if (year === currentDate.getFullYear() && month === 8) return;

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
          date: { start: currentDate, locale: { weekStart: 1 }, min: new Date('2005-01-01'), max: new Date(`${currentDate.getFullYear()}-12-31`)  },
          itemSelector: '.calendar',
        },
        [
          [
            Tooltip,
            {
              text: function (date: any, value: any, dayjsDate: { format: (arg0: string) => string; }) {
                return (
                  (value ? value : 0) + ' post(s) on ' + dayjsDate.format('LL')
                );
              },
            },
          ],
        ]);

        
        return () => {
          currentCal.destroy();
          setMonth(new Date().getMonth());
          setYear(new Date().getFullYear());
        }
      }, [cal, currentDate, data]);

      useEffect(() => {
        requestAnimationFrame(() => {
          cal.current.jumpTo(new Date(`${year}-${month+1}-01`), true)
        })
        
      }, [year, month])

    return (
        <div className="CalHeatMap">
            { error && <div>{ error.message }</div> }

            { !error && data.data &&
            (
            <>
            <label htmlFor="month" className="px-2 my-2">month:</label>
            <select 
              className="month form-select w-auto d-inline" 
              value={month} 
              id="month" 
              name="month" 
              onChange={(e) => setMonth(Number(e.target.value)) } 
              required
            >
              {months.map((m, index) => (
                <option key={index} value={index}>{m}</option>
              ))}
            </select>
            <label htmlFor="year" className="px-2 my-2">year:</label>
            <select 
              className="year form-select w-auto d-inline" 
              value={year} 
              id="month" 
              name="year"
              onChange={(e) => setYear(Number(e.target.value)) } 
              required
            >
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
