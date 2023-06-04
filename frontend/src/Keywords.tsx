import { FC } from "react";
import { useFetch } from "./customHooks/useFetch";
import { IWidget } from "./interfaces/IWidget";

export const Keywords: FC<IWidget> = ({ sub }) => {
    const { data: keywords, error }: any = useFetch(`http://localhost:8080/widget/keywords/${sub}`);

    return (
        <div className="Keywords">
            { error && ( <div className="error">{ error.message }</div> )}
            { !error && keywords.data && keywords.data.map((keyword: any) => (
                <span key={keyword.term}>{ `${keyword.term} ` }
                    <span>{ `(${keyword.score}) ` }</span>
                </span>
            )) }
        </div>
    );
}
