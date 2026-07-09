import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useUserContext } from "../contexts/UserContext";
import { FaSearch, FaPlayCircle } from "react-icons/fa";
import ProfilePopover from "./ProfilePopover";
import "../css/Navbar.css";

function Navbar() {
    const { user, logout, isLoggedIn } = useUserContext();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const drawerRef = useRef(null);

    const avatarUrl = user?.name
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=E5A00D&color=000&size=80`
        : null;

    const handleLogout = () => {
        logout();
        navigate("/login");
        close();
    };

    const close = () => setOpen(false);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            const onKey = (e) => {
                if (e.key === 'Escape') setOpen(false);
            };
            document.addEventListener('keydown', onKey);
            return () => {
                document.removeEventListener('keydown', onKey);
                document.body.style.overflow = '';
            };
        }
    }, [open]);

    return (
        <>
            <nav className={"navbar" + (open ? " is-open" : "")}>
                <div className="navbar-brand">
                    <Link to="/">
                        Movie<span className="brand-yellow">Planet</span>
                    </Link>
                </div>

                    <div className="navbar-links desktop-only">
                    <Link to="/Home" className="nav-link">Home</Link>
                    <Link to="/favourite" className="nav-link">Favourites</Link>
                    <Link to="/watchlist" className="nav-link">Watchlist</Link>
                    <Link to="/collections" className="nav-link">Collections</Link>
                    <Link to="/local" className="nav-link">Local Movies</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="nav-link">Admin</Link>
                    )}
                </div>

                <div className="navbar-right">
                    <div className="nav-icon-group desktop-only">
                        <FaSearch className="nav-icon" title="Search" />
                        <div className="nav-icon" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '600' }}>
                            <FaPlayCircle /> Watch Free
                        </div>
                    </div>

                    <div className="nav-btn-group desktop-only">
                        {isLoggedIn ? (
                            <>
                                <ProfilePopover avatarUrl={avatarUrl} onLogout={handleLogout} />
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-signin">Sign In</Link>
                                <Link to="/register" className="btn-signup">Sign Up Free</Link>
                            </>
                        )}
                    </div>

                    <button
                        className="nav-toggle"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Toggle navigation"
                    >
                        <span className="bar" />
                        <span className="bar" />
                        <span className="bar" />
                    </button>
                </div>
            </nav>

            <div className={"nav-drawer-overlay" + (open ? " is-open" : "")} onClick={close} />

                <aside className={"nav-drawer" + (open ? " is-open" : "")} ref={drawerRef}>
                <Link to="/Home" className="nav-link" onClick={close}>Home</Link>
                <Link to="/favourite" className="nav-link" onClick={close}>Favourites</Link>
                <Link to="/watchlist" className="nav-link" onClick={close}>Watchlist</Link>
                <Link to="/collections" className="nav-link" onClick={close}>Collections</Link>
                <Link to="/local" className="nav-link" onClick={close}>Local Movies</Link>
                {user?.role === 'admin' && (
                    <Link to="/admin" className="nav-link" onClick={close}>Admin</Link>
                )}
                <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />
                {isLoggedIn ? (
                    <>
                        <button className="nav-link nav-link-button" onClick={() => { close(); navigate('/Home'); }} >Profile</button>
                        <button className="btn-logout" onClick={handleLogout} style={{ width: '100%' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn-signin" onClick={close} style={{ textAlign: 'center' }}>Sign In</Link>
                        <Link to="/register" className="btn-signup" onClick={close} style={{ textAlign: 'center' }}>Sign Up Free</Link>
                    </>
                )}
            </aside>
        </>
    );
}

export default Navbar;
