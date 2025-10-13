import { useState } from 'react';
import React from 'react';  
import { Link } from 'react-router-dom';
import { BiGridAlt, BiBarChartAlt2, BiFolder, BiChevronsLeft, BiChevronDown, BiLogOut } from 'react-icons/bi';
import './css/Sidebar.css';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState([]);
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.get('http://localhost/api/Logout.php', { withCredentials: true });
            setAuth({});
            navigate('/login');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarClosed(!isSidebarClosed);
        setOpenDropdowns([]); // Optionally close all dropdowns when sidebar closes
    };

    const toggleDropdown = (index) => {
        if (isSidebarClosed) {
            setIsSidebarClosed(false); // Open sidebar if it's closed
        }

        if (openDropdowns.includes(index)) {
            // If already open, remove it
            setOpenDropdowns(openDropdowns.filter((i) => i !== index));
        } else {
            // If not open, add it
            setOpenDropdowns([...openDropdowns, index]);
        }
    };

    return (
        <aside id="mSidebar" className={isSidebarClosed ? "mSidebar-close" : ""}>
            <ul>
                <li>
                    <span className="mSidebar-logo">KLynx+</span>
                    <button id="mSidebar-Toggle-Btn" onClick={toggleSidebar}>
                        <BiChevronsLeft className="BiChevronsLeft mSidebarLogo" />
                    </button>
                </li>
                <li className="mSidebar-Active">
                    <Link to="" onClick={() => { if (isSidebarClosed) setIsSidebarClosed(false); }}>
                        <BiGridAlt className="BiGridAlt mSidebarLogo" />
                        <span><strong>Main</strong></span>
                    </Link>
                </li>
                <li className="sub-mSidebar-Nondropdown">
                    <Link to="/DashboardAlt">Dashboard</Link>
                    <Link to="/GeoMap">GeoMap</Link>
                    <Link to="/Calendar">Calendar</Link>
                </li>
                <hr></hr>
                <li>
                    <Link to="" onClick={() => { if (isSidebarClosed) setIsSidebarClosed(false); }}>
                        <BiFolder className="BiFolder mSidebarLogo" />
                        <span><strong>File Maintenance</strong></span>
                    </Link>
                </li>
                <li className="sub-mSidebar-Nondropdown">
                    <Link to="/ICDManager2">ICD-10</Link>
                    <Link to="/NurseNotes">Nurse Notes</Link>
                </li>
                <li>
                    <button className={`mSidebar-dropdown-btn ${openDropdowns.includes(1) ? "rotate" : ""}`} onClick={() => toggleDropdown(1)}>
                        <span>Patient Records</span>
                        <BiChevronDown className="BiChevronDown mSidebarLogo" />
                    </button>
                    <ul className={`sub-mSidebar ${openDropdowns.includes(1) ? "show" : ""}`}>
                        <div>
                            <li>
                                <button className={`mSidebar-dropdown-btn2 ${openDropdowns.includes(101) ? "rotate" : ""}`} onClick={() => toggleDropdown(101)}>
                                    <span>Patient Consultation</span>
                                    <BiChevronDown className="BiChevronsLeft mSidebarLogo" />
                                </button>
                                <ul className={`sub-mSidebar2 ${openDropdowns.includes(101) ? "show" : ""}`}>
                                    <div>
                                        <li><Link to="/Consultation">Patient's Consultation</Link></li>
                                        {/*<li><Link to="/Prescription">Doctor's Prescription</Link></li>
                                        <li><Link to="/Note">Doctor's Note</Link></li>*/}
                                    </div>
                                </ul>
                            </li>
                            <li>
                                <button className={`mSidebar-dropdown-btn2 ${openDropdowns.includes(102) ? "rotate" : ""}`} onClick={() => toggleDropdown(102)}>
                                    <span>Maternal Care</span>
                                    <BiChevronDown className="BiChevronsLeft mSidebarLogo" />
                                </button>
                                <ul className={`sub-mSidebar2 ${openDropdowns.includes(102) ? "show" : ""}`}>
                                    <div className="sub-mSidebar2-sub-Maternal">
                                        <li><Link to="/Prenatal">Prenatal</Link></li>
                                        {/*<li><Link to="/">Intrapartum</Link></li>
                                        <li><Link to="/">Postpartum</Link></li>*/}
                                    </div>
                                </ul>
                            </li>
                            <li><Link to="/Immunization">Immunization Records</Link></li>
                            {/*<li><Link to="/AnimalBite">Animal Bite Incident Records</Link></li>*/}
                        </div>
                    </ul>
                </li>
                <li>
                    <button className={`mSidebar-dropdown-btn ${openDropdowns.includes(2) ? "rotate" : ""}`} onClick={() => toggleDropdown(2)}>
                        <span>Accounts</span>
                        <BiChevronDown className="BiChevronDown mSidebarLogo" />
                    </button>
                    <ul className={`sub-mSidebar ${openDropdowns.includes(2) ? "show" : ""}`}>
                        <div>
                            <li><Link to="/Staff">Staff</Link></li>
                            <li><Link to="/Doctors">Doctors</Link></li>
                            <li><Link to="/Nurse">Nurse</Link></li>
                            <li><Link to="/Patient">Patients</Link></li>
                        </div>
                    </ul>
                </li>
                <hr></hr>
                <li>
                    <Link to="" onClick={() => { if (isSidebarClosed) setIsSidebarClosed(false); }}>
                        <BiBarChartAlt2 className="BiBarChartAlt2 mSidebarLogo" />
                        <span><strong>Reports</strong></span>
                    </Link>
                </li>
                <li className="sub-mSidebar-Nondropdown">
                    {/*<Link to="/">Patient Health Record</Link>*/}
                    <Link to="/DiseaseReport">Medical Report</Link>
                    {/*<Link to="">Animal Bite Incident Report</Link>
                    <Link to="">Maternal Care Report</Link>*/}
                </li>

                <li className="mSidebar-logout">
                    
                    <Link to="" onClick={() => { if (isSidebarClosed) setIsSidebarClosed(false); handleLogout(); }}>
                        <BiLogOut className="BiFolder mSidebarLogo" />
                        <span><strong>Logout</strong></span>
                    </Link>
                
                </li>
            </ul>
        </aside>
    )
}

export default Sidebar


/*

    <aside className="mSidebar">
        <div className="mSidebar-logo">
            <BiBookAlt />
            <h2>Medika</h2>
        </div>

        <div className="mSidebar-List">
            <Link to="/" className="mSidebar-Item">
                <BiGridAlt />
                Dashboard
            </Link>
            <Link to="/" className="mSidebar-Item">
                <BiTask />
                Assignment
            </Link>
            <Link to="/" className="mSidebar-Item">
                <BiSolidReport />
                Report
            </Link>
            <Link to="/" className="mSidebar-Item">
                <BiStats />
                Stats
            </Link>
            <Link to="/" className="mSidebar-Item">
                <BiMessage />
                Message
            </Link>
            <Link to="/" className="mSidebar-Item">
                <BiHelpCircle />
                Help
            </Link>
        </div>
    </aside>

*/