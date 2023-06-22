import { FC } from "react";
import { Link } from "react-router-dom";
interface INotFoundProps {};

export const NotFound: FC<INotFoundProps> = (props) => {
    return (
        <div className="NotFound w-50 m-auto py-5 text-center">
            <h2>Sorry</h2>
            <h4>That page cannot be found</h4>
            <Link to="/">Back to the homepage...</Link>
        </div>
    );
}
