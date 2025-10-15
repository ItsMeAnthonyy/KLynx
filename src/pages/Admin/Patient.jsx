import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../components/css/GlobalContainer.css';
import '../../components/css/DashboardAlt.css';
import '../../components/css/FileMaintenance.css'
import './Doctors.css'
import axios from 'axios'; 
import {  BiSolidEdit, BiSolidTrash } from 'react-icons/bi';
import { BiError } from 'react-icons/bi';
import ProfileDropdown from '../../components/ProfileDropdown';

const Patient = () => {

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
        axios.post('http://localhost/api/Patient.php', addDoctorsInputs).then(function(response){
            console.log(response.data);
            getDoctorsList();
            setSelectedDoctor(null);
            setShowModal(false);
        });
    }

    function getDoctorsList() {
        axios.get('http://localhost/api/Patient.php').then(function(response){
            console.log(response.data);
            setDoctorsList(response.data);
        });
    }

    useEffect( () => {
            getDoctorsList();
    }, []);

    const viewDoctor = async (id) => {
        const response = await axios.get(`http://localhost/api/Patient.php?id=${id}`);
        setSelectedDoctor(response.data);
        setViewDoctorModal(true);
        console.log(response.data);
    }

    const editDoctor = async (id) => {
        const response = await axios.get(`http://localhost/api/Patient.php?id=${id}`);
        setSelectedDoctor(response.data);
        setEditDoctorModal(true);
    }

    const handleEditSubmit = (e) =>{
        e.preventDefault();
        console.log(selectedDoctor);

        axios.put(`http://localhost/api/Patient.php?id=${selectedDoctor.PatientID}`, selectedDoctor).then(function(response){
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
        axios.delete(`http://localhost/api/Patient.php?id=${id}`).then(function(response){
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
                           <h1>Patients</h1>
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
                                <th>Patient ID</th>
                                <th>Family ID</th>
                                <th>First Name</th>
                                <th>Middle Name</th>
                                <th>Last Name</th>
                                <th>Sex</th>
                                <th colSpan="3">Manage Account</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctorsList.map((doctorsL, key) => (
                            <tr key={key}>
                                <td>
                                    {doctorsL.PatientID}
                                </td>
                                <td>
                                    {doctorsL.FamilyID}
                                </td>
                                <td>
                                    {doctorsL.FirstName}
                                </td>
                                <td>
                                    {doctorsL.MiddleName}
                                </td>
                                <td>
                                    {doctorsL.LastName}
                                </td>
                                <td>
                                    {doctorsL.Sex}
                                </td>
                                <td>
                                    <button onClick={() => viewDoctor(doctorsL.PatientID) }>View</button>
                                </td>
                                <td>
                                    <button onClick={() => editDoctor(doctorsL.PatientID) } style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Edit" >
                                    <BiSolidEdit className="FileMaintenance-TableIcon FileMaintenance-IconEdit" />  </button>
                                </td>
                                <td>
                                    <button onClick={() => { setSelectedDoctor(doctorsL.PatientID); setDeleteDoctorModal(true); } } style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Delete" >
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
                    <h2>Add Patient</h2>
                    <form className="add-doctors-form" onSubmit={handleAddDoctorsSubmit}>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-firstName">First Name:</label>
                                <input type="text" id="add-doctors-firstName" name="fName" placeholder="Enter first name" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-middleName">Middle Name:</label>
                                <input type="text" id="add-doctors-middleName" name="mName" placeholder="Enter middle name" onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-lastName">Last Name:</label>  
                                <input type="text" id="add-doctors-lastName" name="lName" placeholder="Enter last name" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-suffix">Suffix:</label>  
                                <input type="text" id="add-doctors-suffix" name="suffix" placeholder="Enter suffix" onChange={handleAddDoctorsChange} />
                            </div>
                        </div>
                        <div className="add-doctors-column">
                            <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-specialty">Birthdate:</label>
                                    <input type="date" id="add-doctors-specialty" name="birthDate" placeholder="Enter birthdate" required onChange={handleAddDoctorsChange} />
                            </div>
                            <div className="add-doctors-input-box">
                                <label htmlFor="add-doctors-contactNumber">Family ID:</label>
                                <input type="text" id="add-doctors-contactNumber" name="familyID" placeholder="Enter family id" required onChange={handleAddDoctorsChange} />
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
                        <h2>View Patient</h2>
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
                                    <label htmlFor="add-doctors-suffix">Suffix:</label>  
                                    <input type="text" id="add-doctors-suffix" name="suffix" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Suffix} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-licensingNumber">Birthdate:</label>
                                    <input type="text" id="add-doctors-licensingNumber" name="Birthdate" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Birthdate} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-specialty">Family ID:</label>
                                    <input type="text" id="add-doctors-specialty" name="FamilyID" className="add-doctors-shaded-input" readOnly value={selectedDoctor.FamilyID} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-lastName">Sex:</label>  
                                    <input type="text" id="add-doctors-lastName" name="sex" className="add-doctors-shaded-input" readOnly value={selectedDoctor.Sex} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-homeAddress">Patient ID:</label>
                                    <input type="text" id="add-doctors-homeAddress" name="PatientID" className="add-doctors-shaded-input" readOnly value={selectedDoctor.PatientID} />
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
                        <h2>Edit Patient</h2>
                        <form className="add-doctors-form" onSubmit={handleEditSubmit}>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-firstName">First Name:</label>
                                    <input type="text" id="add-doctors-firstName" name="fName" value={selectedDoctor.FirstName} onChange={handleEditDoctorsChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-middleName">Middle Name:</label>
                                    <input type="text" id="add-doctors-middleName" name="MiddleName" value={selectedDoctor.MiddleName} onChange={handleEditDoctorsChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-lastName">Last Name:</label>  
                                    <input type="text" id="add-doctors-lastName" name="lName" value={selectedDoctor.LastName} onChange={handleEditDoctorsChange} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-specialty">Birthdate:</label>
                                    <input type="text" id="add-doctors-specialty" name="Birthdate" value={selectedDoctor.Birthdate} onChange={handleEditDoctorsChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-specialty">Family ID:</label>
                                    <input type="text" id="add-doctors-specialty" name="FamilyID" value={selectedDoctor.FamilyID} onChange={handleEditDoctorsChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-lastName">Sex:</label>  
                                    <input type="text" id="add-doctors-lastName" name="sex" value={selectedDoctor.Sex} onChange={handleEditDoctorsChange} />
                                </div>
                            </div>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label htmlFor="add-doctors-homeAddress">Patient ID:</label>
                                    <input type="text" id="add-doctors-homeAddress" className="add-doctors-shaded-input" readOnly value={selectedDoctor.PatientID} />
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

export default Patient;