import { FC, FormEvent, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import './css/navbar.css'
interface INavbarProps {};

export const Navbar: FC<INavbarProps> = () => {
    const [sub, setSub] = useState('');
    const navigation = [
        { name: "Home", to: "/" },
        { name: "Subreddits", to: "/subList" },
        { name: "Search posts", to: "/search" }
    ]

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
                <div className="form-inline mx-auto">
                    <form className="form-inline input-group" onSubmit={ (e) => { handleSubmit(e) }}>
                        <span className="input-group-text">r/</span>
                        <input type="text" placeholder="Subreddit" value={sub} onChange={ (e) => setSub((e.target as HTMLInputElement).value) } />
                        <Link to={`/sub/${sub}`}>
                            <button className="btn btn-primary" type="submit">Search</button>
                        </Link>
                    </form>
                </div>
            
                <div className="navbar-nav my-2 my-lg-0">
                    { navigation.map((item) => (
                        <NavLink
                            exact
                            key={item.name}
                            to={item.to}
                            className={ (isActive: boolean ) => {
                                return ('nav-link px-3 py-2 rounded' + (isActive ? ' active fw-bold' : ''));
                            } } 
                        >
                        { item.name }
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
}
