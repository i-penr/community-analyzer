import { FC, FormEvent, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import './css/navbar.css'
interface INavbarProps { };

export const Navbar: FC<INavbarProps> = () => {
    const [sub, setSub] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return (
        <nav className="navbar navbar-expand-lg sticky-top px-5 py-2 navbar-dark bg-dark">
            <Link to={"/"} className="navbar-brand">Reddit Community Analyzer</Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <div className="navbar-nav my-2 my-lg-0">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink
                                exact
                                to="/"
                                className={(isActive: boolean) => {
                                    return ('nav-link px-3 py-2 rounded' + (isActive ? ' active fw-bold' : ''));
                                }}
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                                Subreddits
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li>
                                    <NavLink
                                        exact
                                        to="/subList"
                                        className={(isActive: boolean) => {
                                            return ('dropdown-item px-3 py-2 rounded' + (isActive ? ' active fw-bold' : ''));
                                        }}
                                    >
                                        Subreddit List
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        exact
                                        to="/addSub"
                                        className={(isActive: boolean) => {
                                            return ('dropdown-item px-3 py-2 rounded' + (isActive ? ' active fw-bold' : ''));
                                        }}
                                    >
                                        Add a Subreddit
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
                                Posts
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <NavLink
                                        exact
                                        to="/searchPosts"
                                        className={(isActive: boolean) => {
                                            return ('dropdown-item px-3 py-2 rounded' + (isActive ? ' active fw-bold' : ''));
                                        }}
                                    >
                                        Search Posts
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        exact
                                        to="/addPost"
                                        className={(isActive: boolean) => {
                                            return ('dropdown-item px-3 py-2 rounded' + (isActive ? ' active fw-bold' : ''));
                                        }}
                                    >
                                        Add Post
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <form className="form-inline" onSubmit={(e) => { handleSubmit(e) }}>
                <div className="input-group">
                    <span className="input-group-text">r/</span>
                    <input type="text" placeholder="View Subreddit Stats" value={sub} onChange={(e) => setSub((e.target as HTMLInputElement).value)} />
                    <Link to={`/sub/${sub}`}>
                        <button className="btn btn-primary" type="submit">Search</button>
                    </Link>
                </div>
            </form>
        </nav>
    );
}
