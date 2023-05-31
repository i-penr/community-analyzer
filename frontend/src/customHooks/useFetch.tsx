import { useEffect, useState } from "react";

export const useFetch = (url: string) => {
    const [data, setData] = useState([]);
    const [error, setError]: any = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        fetch(url, { signal: abortController.signal })
            .then((res) => {
                if (!res.ok) {
                    throw Error('There was an error in the request', { cause: res });
                }

                return res.json();
            })
            .then((data) => {
                setData(data);
                setError(null);
            }).catch((err) => {
                if (err.name !== 'AbortError')
                    setError(err);
            });
        
        return () => {
            abortController.abort();
        }
    }, [url]);

    return { data, error }
}