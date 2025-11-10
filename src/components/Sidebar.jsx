import { useState } from 'react';

import { Link } from 'react-router-dom';
import { BiGridAlt, BiBarChartAlt2, BiFolder, BiChevronsLeft, BiChevronDown, BiLogOut } from 'react-icons/bi';
import './css/Sidebar.css';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { hasPermission, PERMISSIONS } from '../utils/rolePermissions';

const Sidebar = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState([]);
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    // Get user's role code
    const userRoleCode = auth?.roles?.[0];

    // Helper function to check if user has permission
    const checkPermission = (permission) => {
        if (!userRoleCode) return false;
        return hasPermission(userRoleCode, permission);
    };

    // Check if user has any File Maintenance access
    const hasFileMaintenance = checkPermission(PERMISSIONS.ICD_VIEW) || 
                                checkPermission(PERMISSIONS.NURSE_NOTES_VIEW) || 
                                checkPermission(PERMISSIONS.USER_MANAGEMENT_VIEW) || 
                                checkPermission(PERMISSIONS.NOTIFICATIONS_VIEW);

    // Check if user has any Patient Records access
    const hasPatientRecords = checkPermission(PERMISSIONS.HEALTH_RECORDS_VIEW) || 
                               checkPermission(PERMISSIONS.IMMUNIZATION_VIEW) || 
                               checkPermission(PERMISSIONS.ANIMAL_BITE_VIEW);

    // Check if user has any Reports access
    const hasReports = checkPermission(PERMISSIONS.REPORTS_VIEW);


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
                {hasFileMaintenance && (
                    <>
                        <li>
                            <Link to="" onClick={() => { if (isSidebarClosed) setIsSidebarClosed(false); }}>
                                <BiFolder className="BiFolder mSidebarLogo" />
                                <span><strong>File Maintenance</strong></span>
                            </Link>
                        </li>
                        <li className="sub-mSidebar-Nondropdown">
                            
                            {checkPermission(PERMISSIONS.NURSE_NOTES_VIEW) && (
                                <Link to="/NurseNotes">Nurse Notes</Link>
                            )}
                            {checkPermission(PERMISSIONS.USER_MANAGEMENT_VIEW) && (
                                <Link to="/UserManagement">User Management</Link>
                            )}
                            {checkPermission(PERMISSIONS.NOTIFICATIONS_VIEW) && (
                                <Link to="/Notifications">Notifications</Link>
                            )}
                            {checkPermission(PERMISSIONS.NOTIFICATIONS_VIEW) && (
                                <Link to="/StaffHealthRecord">Medical Staff Health Record</Link>
                            )}

                        </li>
                    </>
                )}
                {hasPatientRecords && (
                <li className='sub-mSidebar-Nondropdown'>
                    
                       
                            {checkPermission(PERMISSIONS.HEALTH_RECORDS_VIEW) && (
                                <li>

                                    <Link to="/Patients">Patient List</Link>
                                </li>
                            )}
                            {checkPermission(PERMISSIONS.QUEUE_MANAGEMENT_VIEW) && (
                                <li>

                                    <Link to="/QueueManagement">Queue Management</Link>
                                </li>
                            )}
                            
                            <li>

                                    <Link to="/Archives">Archives</Link>
                                </li>
                       
                    
                </li>
                )}

                

                {/* {hasPatientRecords && (
                    <>
                        <li>
                            <button className={`mSidebar-dropdown-btn ${openDropdowns.includes(2) ? "rotate" : ""}`} onClick={() => toggleDropdown(2)}>
                                <span>Accounts</span>
                                <BiChevronDown className="BiChevronDown mSidebarLogo" />
                            </button>
                            <ul className={`sub-mSidebar ${openDropdowns.includes(2) ? "show" : ""}`}>
                                <div>
                                    {checkPermission(PERMISSIONS.HEALTH_RECORDS_VIEW) && (
                                        <>
                                            <li><Link to="/Staff">Staff</Link></li>
                                            <li><Link to="/Doctors">Doctors</Link></li>
                                            <li><Link to="/Nurse">Nurse</Link></li>
                                            <li><Link to="/Patient">Patients</Link></li>
                                        </>
                                    )}
                                </div>
                            </ul>
                        </li>
                    </>
                )} */}
                <hr></hr>
                {hasReports && (
                    <>
                        <li>
                            <Link to="" onClick={() => { if (isSidebarClosed) setIsSidebarClosed(false); }}>
                                <BiBarChartAlt2 className="BiBarChartAlt2 mSidebarLogo" />
                                <span><strong>Reports</strong></span>
                            </Link>
                        </li>
                        <li className="sub-mSidebar-Nondropdown">
                      
                            <Link to="/DiseaseReport">Medical Report</Link>
                            <Link to="/AnimalBiteReport">Animal Bite Incident Report</Link>
                            <Link to="/MaternalReport">Maternal Care Report</Link>
                        </li>
                    </>
                )}

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