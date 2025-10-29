import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../components/css/GlobalContainer.css';
import '../../components/css/DashboardAlt.css';
import '../../components/css/FileMaintenance.css'
import './Doctors.css'
import axios from 'axios';
 
import {BiSolidEdit, BiSolidTrash } from 'react-icons/bi';
import { BiError } from 'react-icons/bi';
import ProfileDropdown from '../../components/ProfileDropdown';

const Nurse = () => {

    const [showModal, setShowModal] = useState(false);
    const [addDoctorsInputs, setAddDoctorsInputs] = useState({ sex: "Male" });
    const [doctorsList, setDoctorsList] = useState([]);
    const [viewDoctorModal, setViewDoctorModal] = useState(false);
    const [editDoctorModal, setEditDoctorModal] = useState(false);
    const [deleteDoctorModal, setDeleteDoctorModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const handleModalOpen = () =>{
        setShowModal(true);
    }    

    const handleAddDoctorsChange = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        setAddDoctorsInputs(values => ({...values, [name]: value}));
    }

    const handleAddDoctorsSubmit = (e) =>{
        e.preventDefault();
        console.log(addDoctorsInputs);
        axios.post('http://localhost/api/Nurse.php', addDoctorsInputs).then(function(response){
            console.log(response.data);
            getDoctorsList();
            setSelectedDoctor(null);
            setShowModal(false);
        });
    }

    function getDoctorsList() {
        axios.get('http://localhost/api/Nurse.php').then(function(response){
            console.log(response.data);
            setDoctorsList(response.data);
        });
    }

    useEffect( () => {
            getDoctorsList();
    }, []);

    const viewDoctor = async (id) => {
        const response = await axios.get(`http://localhost/api/Nurse.php?id=${id}`);
        setSelectedDoctor(response.data);
        setViewDoctorModal(true);
        console.log(response.data);
    }

    const editDoctor = async (id) => {
        const response = await axios.get(`http://localhost/api/Nurse.php?id=${id}`);
        console.log("Before Doctor: ",selectedDoctor);
        console.log(response.data);
        setSelectedDoctor(response.data);
        setEditDoctorModal(true);
    }

    const handleEditSubmit = (e) =>{
        e.preventDefault();
        console.log(selectedDoctor);

        axios.put(`http://localhost/api/Nurse.php?id=${selectedDoctor.AdminID}`, selectedDoctor).then(function(response){
            console.log(response.data);
            getDoctorsList();
            setSelectedDoctor(null);
            setEditDoctorModal(false);
        });
    }

    const handleEditDoctorsChange = (e) =>{
        const name = e.target.name;
        const value = e.target.value;
        setSelectedDoctor(values => ({...values, [name]: value}));
    }

    const deleteDoctor = (id) => {
        axios.delete(`http://localhost/api/Nurse.php?id=${id}`).then(function(response){
            console.log(response.data);
            getDoctorsList();
            setSelectedDoctor(null);
            setDeleteDoctorModal(false);
        });
    }

    return (
        <div className="FileMaintenance-Container">
            <Sidebar />
            <main className="FileMaintenance-Content">
                 <div className="FileMaintenance-Header">
                          <div className="FileMaintenance-HeaderTitle">
                            <h1>Nurse</h1>
                          </div>
                
                          <div className="FileMaintenance-HeaderSetting">
                            <button className="emergency-button">
                              <BiError/>EMERGENCY MODE
                            </button>
                            <ProfileDropdown 
                              email="admin@klynx.com"
                              name="Admin User"
                            />
                          </div>
                        </div>
                <hr></hr>
                <div className="FileMaintenance-Filter-Container">
                    <div className="FileMaintenance-Entries">
                        <span>Show</span>
                        <select>
                            <option hidden></option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                        </select>
                        <span>Entries</span>
                    </div>
                    <div className="FileMaintenance-AddSearch">
                            <button onClick={() => handleModalOpen()}>Add</button>
                            <span>Search:</span>
                            <input type="text" placeholder="Search here..."/>
                    </div>
                </div>
                <div className="FileMaintenance-TableWrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Admin ID</th>
                                <th>Last Name</th>
                                <th>First Name</th>
                                <th>Middle Name</th>
                                <th>Email</th>
                                <th>Contact No.</th>
                                <th colSpan="3">Manage Account</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctorsList.map((doctorsL, key) => (
                            <tr key={key}>
                                <td>
                                    {doctorsL.AdminID}
                                </td>
                                <td>
                                    {doctorsL.LastName}
                                </td>
                                <td>
                                    {doctorsL.FirstName}
                                </td>
                                <td>
                                    {doctorsL.MiddleName}
                                </td>
                                <td>
                                    {doctorsL.EmailAddress}
                                </td>
                                <td>
                                    {doctorsL.ContactNumber}
                                </td>
                                <td>
                                    <button onClick={() => viewDoctor(doctorsL.AdminID) }>View</button>
                                </td>
                                <td>
                                    <button onClick={() => editDoctor(doctorsL.AdminID) } style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Edit" >
                                    <BiSolidEdit className="FileMaintenance-TableIcon FileMaintenance-IconEdit" />  </button>
                                </td>
                                <td>
                                    <button onClick={() => { setSelectedDoctor(doctorsL.AdminID); setDeleteDoctorModal(true); } } style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Delete" >
                                    <BiSolidTrash className="FileMaintenance-TableIcon" />  </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* MODALS SECTION */}
            {showModal && (
            <div className="add-doctors-popup-overlay">
                <div className="add-doctors-popup-content">
                    <button className="doctors-popup-close-button" onClick={(e) => { e.preventDefault(); setShowModal(false); setSelectedDoctor({}); } }>
                        X
                    </button>
                    <h2>Add Nurse</h2>
                    <form className="add-doctors-form" onSubmit={handleAddDoctorsSubmit}>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-firstName">First Name:</label>
                                <input type="text" id="add-doctors-firstName" name="fName" placeholder="Enter your first name" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-middleName">Middle Name:</label>
                                <input type="text" id="add-doctors-middleName" name="mName" placeholder="Enter your middle name" onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-lastName">Last Name:</label>  
                                <input type="text" id="add-doctors-lastName" name="lName" placeholder="Enter your last name" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <div className="add-doctors-gender-box">
                                    <h3>Sex:</h3>
                                    <div className="add-doctors-gender-option">
                                        <div className="add-doctors-gender">
                                            <input type="radio" id="check-male" name="sex" checked={addDoctorsInputs.sex === "Male"} value="Male" onChange={handleAddDoctorsChange} />
                                            <label htmlFor="check-male">Male</label>
                                        </div>
                                        <div className="add-doctors-gender">
                                            <input type="radio" id="check-female" name="sex" checked={addDoctorsInputs.sex === "Female"} value="Female" onChange={handleAddDoctorsChange} />
                                            <label htmlFor="check-female">Female</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-licensingNumber">Licensing Number:</label>
                                <input type="text" id="add-doctors-licensingNumber" name="licNumber" placeholder="Enter your first name" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-specialty">Specialization:</label>
                                <input type="text" id="add-doctors-specialty" name="specialization" placeholder="Enter your specialization" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label>Position:</label>
                                <div className="add-doctors-select-box">
                                    <select name="position" onChange={handleAddDoctorsChange} required>
                                        <option hidden></option>
                                        <option value="Registered Nurse">Registered Nurse</option>
                                    </select>    
                                </div>   
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-homeAddress">Home Address:</label>
                                <input type="text" id="add-doctors-homeAddress" name="homeAdd" placeholder="Enter your home address" required onChange={handleAddDoctorsChange} />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-contactNumber">Contact Number:</label>
                                <input type="text" id="add-doctors-contactNumber" name="contactNum" placeholder="Enter your contact number" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-emergencyContact">Emergency Contact Number:</label>
                                <input type="text" id="add-doctors-emergencyContact" name="ecNumber" placeholder="Enter your emergency contact number" required onChange={handleAddDoctorsChange} />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-emailAddress">Email Address:</label>
                                <input type="text" id="add-doctors-emailAddress" name="emailAdd" placeholder="Enter your email address" required onChange={handleAddDoctorsChange} />
                            </div>
                        </div>
                        <div className="add-doctors-buttons">
                            <button className="add-doctors-save-button" >Save</button>
                            <button className="add-doctors-cancel-button" onClick={(e) => { e.preventDefault(); setShowModal(false); setSelectedDoctor(null); } }>Close</button>
                        </div>
                    </form>
                </div>
            </div>
            )}
            {viewDoctorModal && selectedDoctor && (

                <div className="add-doctors-popup-overlay">
                    <div className="add-doctors-popup-content">
                        <button className="doctors-popup-close-button" onClick={(e) => { e.preventDefault(); setViewDoctorModal(false); setSelectedDoctor({}); } } > X </button>
                        <h2>Add Doctor</h2>
                        <form className="add-doctors-form" onSubmit={handleAddDoctorsSubmit}>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-firstName">First Name:</label>
                                    <input type="text" id="add-doctors-firstName" name="fName" className="add-doctors-shaded-input" readOnly value={selectedDoctor.FirstName} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-middleName">Middle Name:</label>
                                    <input type="text" id="add-doctors-middleName" name="mName" className="add-doctors-shaded-input" readOnly value={selectedDoctor.MiddleName} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-lastName">Last Name:</label>  
                                    <input type="text" id="add-doctors-lastName" name="lName" className="add-doctors-shaded-input" readOnly value={selectedDoctor.LastName} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-lastName">Sex:</label>  
                                    <input type="text" id="add-doctors-lastName" name="sex" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Sex} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-licensingNumber">Licensing Number:</label>
                                    <input type="text" id="add-doctors-licensingNumber" name="licNumber" className="add-doctors-shaded-input" readOnly value={selectedDoctor.LicensingNumber} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-specialty">Specialty:</label>
                                    <input type="text" id="add-doctors-specialty" name="specialty" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Specialty} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-specialty">Position:</label>
                                    <input type="text" id="add-doctors-specialty" name="position" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Position} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-homeAddress">Home Address:</label>
                                    <input type="text" id="add-doctors-homeAddress" name="homeAdd" className="add-doctors-shaded-input" readOnly value={selectedDoctor.HomeAddress} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-contactNumber">Contact Number:</label>
                                    <input type="text" id="add-doctors-contactNumber" name="contactNum" className="add-doctors-shaded-input" readOnly value={selectedDoctor.ContactNumber} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-emergencyContact">Emergency Contact Number:</label>
                                    <input type="text" id="add-doctors-emergencyContact" name="ecNumber" className="add-doctors-shaded-input" readOnly value={selectedDoctor.EmergencyNumber} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-userID">Admin ID:</label>  
                                    <input type="text" id="add-doctors-userID" name="AdminID" className="add-doctors-shaded-input" readOnly value={selectedDoctor.AdminID} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-emailAddress">Email Address:</label>
                                    <input type="text" id="add-doctors-emailAddress" name="emailAdd" className="add-doctors-shaded-input" readOnly value={selectedDoctor.EmailAddress} />
                                </div>
                            </div>
                            <div className="add-doctors-buttons">
                                <button className="add-doctors-cancel-button" onClick={(e) => { e.preventDefault(); setViewDoctorModal(false); setSelectedDoctor(null); } } >Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editDoctorModal && selectedDoctor && (
            
                <div className="add-doctors-popup-overlay">
                    <div className="add-doctors-popup-content">
                        <button className="doctors-popup-close-button" onClick={(e) => { e.preventDefault(); setEditDoctorModal(false); setSelectedDoctor(null); } }     > X </button>
                        <h2>Edit Doctor</h2>
                        <form className="add-doctors-form" onSubmit={handleEditSubmit}>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-firstName">First Name:</label>
                                    <input type="text" id="add-doctors-firstName" name="fName" className="add-doctors-shaded-input" readOnly value={selectedDoctor.FirstName} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-middleName">Middle Name:</label>
                                    <input type="text" id="add-doctors-middleName" name="MiddleName" value={selectedDoctor.MiddleName} onChange={handleEditDoctorsChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-lastName">Last Name:</label>  
                                    <input type="text" id="add-doctors-lastName" name="lName" className="add-doctors-shaded-input" readOnly value={selectedDoctor.LastName} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-lastName">Sex:</label>  
                                    <input type="text" id="add-doctors-lastName" name="sex" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Sex} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-licensingNumber">Licensing Number:</label>
                                    <input type="text" id="add-doctors-licensingNumber" name="licNumber" className="add-doctors-shaded-input" readOnly value={selectedDoctor.LicensingNumber} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-specialty">Specialty:</label>
                                    <input type="text" id="add-doctors-specialty" name="specialty" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Specialty} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-specialty">Position:</label>
                                    <input type="text" id="add-doctors-specialty" name="position" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Position} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-homeAddress">Home Address:</label>
                                    <input type="text" id="add-doctors-homeAddress" name="HomeAddress" value={selectedDoctor.HomeAddress} onChange={handleEditDoctorsChange} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-contactNumber">Contact Number:</label>
                                    <input type="text" id="add-doctors-contactNumber" name="ContactNumber" value={selectedDoctor.ContactNumber} onChange={handleEditDoctorsChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-emergencyContact">Emergency Contact Number:</label>
                                    <input type="text" id="add-doctors-emergencyContact" name="EmergencyNumber" value={selectedDoctor.EmergencyNumber} onChange={handleEditDoctorsChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-userID">Admin ID:</label>  
                                    <input type="text" id="add-doctors-userID" name="AdminID" className="add-doctors-shaded-input" readOnly value={selectedDoctor.AdminID} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-emailAddress">Email Address:</label>
                                    <input type="text" id="add-doctors-emailAddress" name="emailAdd" className="add-doctors-shaded-input" readOnly value={selectedDoctor.EmailAddress} />
                                </div>
                            </div>
                            <div className="add-doctors-buttons">
                                <button className="add-doctors-save-button" >Save</button>
                                <button className="add-doctors-cancel-button" onClick={(e) => { e.preventDefault(); setEditDoctorModal(false); setSelectedDoctor(null); } } >Close</button>
                            </div>
                        </form>
                    </div>
                </div>

            )}

            {/* WINDOW THAT SHOWS 'DELETE BUTTON' OF DOCTOR */}
            {deleteDoctorModal && selectedDoctor && (
            
                <div className="add-doctors-popup-overlay">
                    <div className="add-doctors-popup-content">
                        <button className="doctors-popup-close-button" onClick={(e) => { e.preventDefault(); setDeleteDoctorModal(false); setSelectedDoctor(null); } }     > X </button>
                        <h2>Confirm Delete</h2>
                        <h4>Are you sure you want to delete this item?</h4>
                            <div className="delete-doctors-buttons">
                                <button className="add-doctors-save-button" onClick={() => deleteDoctor(selectedDoctor) } >Delete</button>
                                <button className="add-doctors-cancel-button" onClick={(e) => { e.preventDefault(); setDeleteDoctorModal(false); setSelectedDoctor(null); } } >Cancel</button>
                            </div>
                    </div>
                </div>

            )}

        </div>
    );
}

export default Nurse;