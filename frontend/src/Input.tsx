import { FC } from "react";
interface IInputProps {};

export const Input: FC<IInputProps> = () => {

    return (
        <div className="Input">
            <span>r/</span>
            <input type="text" placeholder="Subreddit" />
            <input type="submit" value="Search" />
        </div>
    );
}
