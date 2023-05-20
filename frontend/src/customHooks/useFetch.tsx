import { useEffect, useState } from "react";

export const useFetch = (url: string) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isCancelled = false;
        fetch(url, { method: 'POST' })
            .then((res) => {
                if (!res.ok) {
                    throw Error('There was an error in the request');
                }
                return res.json();
            })
            .then((data) => {
                if (!isCancelled) {
                    console.log(data);
                    setData(data);
                }
            }).catch((err) => {
                setError(err);
            });
        
        return () => {
            isCancelled = true;
        }
    }, [url]);

    return { data, error }
}