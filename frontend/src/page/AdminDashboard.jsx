import React, { useState } from "react";
import { FaFilm, FaUsers, FaUserTie, FaChartLine } from "react-icons/fa";
import ManageMovies from "../components/admin/ManageMovies";
import ManageUsers from "../components/admin/ManageUsers";
import ManageCast from "../components/admin/ManageCast";
import "../css/Admin.css";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("movies");

    const renderContent = () => {
        switch (activeTab) {
            case "movies": return <ManageMovies />;
            case "users": return <ManageUsers />;
            case "cast": return <ManageCast />;
            default: return <ManageMovies />;
        }
    };

    return (
        <div className="admin-dashboard">
            <aside className="admin-sidebar">
                <div 
                    className={`sidebar-item ${activeTab === "movies" ? "active" : ""}`}
                    onClick={() => setActiveTab("movies")}
                >
                    <FaFilm /> <span>Movie Management</span>
                </div>
                <div 
                    className={`sidebar-item ${activeTab === "users" ? "active" : ""}`}
                    onClick={() => setActiveTab("users")}
                >
                    <FaUsers /> <span>User Management</span>
                </div>
                <div 
                    className={`sidebar-item ${activeTab === "cast" ? "active" : ""}`}
                    onClick={() => setActiveTab("cast")}
                >
                    <FaUserTie /> <span>Cast & Celebrity</span>
                </div>
                <div className="sidebar-item">
                    <FaChartLine /> <span>Analytics</span>
                </div>
            </aside>

            <main className="admin-main">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;
