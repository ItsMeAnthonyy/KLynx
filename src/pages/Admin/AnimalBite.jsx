import Sidebar from "../../components/Sidebar";
import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import "../../components/css/FileMaintenance.css";
import { BiSolidCog, BiSolidBell, BiSolidEdit, BiSolidTrash, BiError } from 'react-icons/bi';


const AnimalBite = () => {
    const [showModal, setShowModal] = useState(false);
    const [viewHistoryModal, setViewHistoryModal] = useState(false);


   
    // Body part selection state and mapping to specific locations
    const [selectedBodyPart, setSelectedBodyPart] = useState("");
    const [specificLocations, setSpecificLocations] = useState([]);
    const [selectedSpecificLocation, setSelectedSpecificLocation] = useState("");

    const bodyPartLocations = {
        Face: [
            'Forehead',
            'Eyebrow',
            'Eyes',
            'Nose',
            'Cheek',
            'Upper Lip',
            'Lower Lip',
            'Chin',
            'Jaw',
            'Neck',
            'Nape',
            'Ears',
            'Scalp'
        ],
        Head: ['Scalp', 'Temple', 'Forehead'],
        Torso: ['Chest', 'Abdomen', 'Back'],
        'Left Arm': ['Upper Arm', 'Elbow', 'Forearm', 'Wrist', 'Hand', 'Fingers'],
        'Right Arm': ['Upper Arm', 'Elbow', 'Forearm', 'Wrist', 'Hand', 'Fingers'],
        'Left Leg': ['Thigh', 'Knee', 'Shin', 'Ankle', 'Foot', 'Toes'],
        'Right Leg': ['Thigh', 'Knee', 'Shin', 'Ankle', 'Foot', 'Toes']
    };

    const handleBodyPartClick = (part) => {
        setSelectedBodyPart(part);
        const locs = bodyPartLocations[part] || [];
        setSpecificLocations(locs);
        setSelectedSpecificLocation("");
    };

    const [showOthers, setShowOthers] = useState(false);
    const postExposureSpecifyRef = useRef(null);
    const typeOfAnimalSpecifyRef = useRef(null);
    const specifyContactRef = useRef(null);

    // Declare conditional state variables here so they are initialized
    // before any useEffect that references them (avoid TDZ reference errors)
    const [ShowActiveImmunenization, setShowActiveImmunenization] = useState(false);
    const [showTypeOfAnimalOthers, setShowTypeOfAnimalOthers] = useState(false);
    const [showSpecifyVaccine, setShowSpecifyVaccine] = useState(false);
    const [showSpecifyContact, setShowSpecifyContact] = useState(false);

    // Autofocus the 'Please Specify' / conditional inputs when they appear
    useEffect(() => {
        if (showOthers && postExposureSpecifyRef.current) {
            postExposureSpecifyRef.current.focus();
        }
    }, [showOthers]);

    useEffect(() => {
        if (showTypeOfAnimalOthers && typeOfAnimalSpecifyRef.current) {
            typeOfAnimalSpecifyRef.current.focus();
        }
    }, [showTypeOfAnimalOthers]);

    useEffect(() => {
        if (showSpecifyContact && specifyContactRef.current) {
            specifyContactRef.current.focus();
        }
    }, [showSpecifyContact]);

    // Show the 'Please Specify' input when user selects 'others'
    const handlePostExposureChange = (e) => {
        setShowOthers(e.target.value === 'others');
    };
    
    const handleActiveImmunizationChange = (e) => {
        setShowActiveImmunenization(e.target.value === 'yes');
    };

    const handleTypeOfAnimalChange = (e) => {
        setShowTypeOfAnimalOthers(e.target.value === 'others');
    };

    const handleSpecifyVaccineChange = (e) => {
        setShowSpecifyVaccine(e.target.value === 'yes');
    };

    const handleSpecifyContactChange = (e) => {
        setShowSpecifyContact(e.target.value === 'yes');
    };

    // --- CRUD states and handlers (form uses the modal fields) ---
    const [records, setRecords] = useState([]);
    const [formData, setFormData] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loadingRecords, setLoadingRecords] = useState(false);
   

    const API_URL = 'http://localhost/api/animalBite.php';

    const fetchRecords = async () => {
        setLoadingRecords(true);
        try {
            const res = await axios.get(API_URL);
            // expect res.data to be an array of records
            setRecords(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load records.' });
            console.error(err);
        } finally {
            setLoadingRecords(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);


    const clearMessage = () => setMessage({ type: '', text: '' });

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        if (!name) return;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmitCrud = async (e) => {
        e.preventDefault();
        clearMessage();
        try {
            if (editingId == null) {
                // create
                await axios.post(API_URL, formData);
                setMessage({ type: 'success', text: 'Record created successfully.' });
            } else {
                // update
                await axios.put(API_URL, { id: editingId, ...formData });
                setMessage({ type: 'success', text: 'Record updated successfully.' });
            }
            setFormData({});
            setEditingId(null);
            setShowModal(false);
            await fetchRecords();
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Operation failed. See console for details.' });
        }
    };

    const handleEdit = (record) => {
        setEditingId(record.id ?? record.ID ?? null);
        setFormData({ ...record });
        clearMessage();
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        clearMessage();
        if (!window.confirm('Delete this record?')) return;
        try {
            // axios.delete supports sending a request body via config.data
            await axios.delete(API_URL, { data: { id } });
            setMessage({ type: 'success', text: 'Record deleted.' });
            await fetchRecords();
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Delete failed.' });
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({});
        clearMessage();
        setShowModal(false);
    };

    return (
        <div className="FileMaintenance-Container">
            <Sidebar />
            <main className="FileMaintenance-Content">
                <div className="FileMaintenance-Header">
                    <div className="FileMaintenance-HeaderTitle">
                        <h1>Animal Bite Report</h1>
                    </div>

                    <div className="FileMaintenance-HeaderSetting">
                        <button><BiError/>EMERGENCY MODE</button>
                        <BiSolidBell className="FileMaintenance-Icon" />
                        <BiSolidCog className="FileMaintenance-Icon" /> 
                    </div>
                </div>
                <hr />

                <div className="FileMaintenance-Filter-Container">
                    <div className="FileMaintenance-StatCard">
                        <h3>Total Records {AnimalBite.totalRecords}</h3>
                    </div>
                    <div className="FileMaintenance-StatCard">
                        <h3>Active Cases {AnimalBite.activeCases}</h3>
                    </div>
                    <div className="FileMaintenance-StatCard">
                        <h3>Follow up {AnimalBite.followUp}</h3>
                    </div>
                    <div className="FileMaintenance-StatCard">
                        <h3>Schedule {AnimalBite.schedule}</h3>

                    </div>
                </div>

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
                        <button onClick={() => setShowModal(true)}>Add</button>
                        <span>Search:</span>
                        <input type="text" placeholder="Search here..."/>
                    </div>
                </div>

                <div className="FileMaintenance-TableContainer">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Patient ID</th>
                                <th>Family ID</th>
                                <th>Full Name</th>
                                <th>Contact Number</th>
                                <th>Sex</th>
                                <th colSpan="3">Record</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingRecords ? (
                                <tr><td colSpan="9">Loading...</td></tr>
                            ) : records.length === 0 ? (
                                <tr><td colSpan="9">No records found.</td></tr>
                            ) : (
                                records.map((rec) => (
                                    <tr key={rec.id ?? rec.ID}>
                                        <td>{rec.date ?? ''}</td>
                                        <td>{rec.patient_id ?? rec.patientId ?? rec.PatientID ?? ''}</td>
                                        <td>{rec.family_id ?? rec.familyId ?? ''}</td>
                                        <td>{rec.name ?? `${rec.firstName ?? ''} ${rec.lastName ?? ''}`}</td>
                                        <td>{rec.contact ?? rec.contactNumber ?? ''}</td>
                                        <td>{rec.sex ?? ''}</td>
                                        <td>
                                            <button onClick={() => setViewHistoryModal(true)}>View History</button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleEdit(rec)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Edit" >
                                                <BiSolidEdit className="FileMaintenance-TableIcon FileMaintenance-IconEdit" />
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(rec.id ?? rec.ID)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} title="Delete" >
                                                <BiSolidTrash className="FileMaintenance-TableIcon" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Add-modal */}
            {showModal && (
                <div className="add-doctors-popup-overlay">
                    <div className="add-doctors-popup-content">
                        <div className="add-doctors-popup-header history-popup-header">
                            <h2>New Patient Profile</h2> 
                            <button className="close-button" onClick={() => setShowModal(false)}>X</button>
                        </div>

                        <form className="add-doctors-form" onSubmit={handleSubmitCrud}>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label className="required">Patient ID</label>
                                    <input name="patientId" type="text" placeholder="Enter Patient ID" required value={formData.patientId ?? ''} onChange={handleFormChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label className="required">Family ID</label>
                                    <input name="familyId" type="text" placeholder="Enter Family ID" required value={formData.familyId ?? ''} onChange={handleFormChange} />
                                </div>
                            </div>

                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label className="required">First Name</label>
                                    <input type="text" placeholder="Enter First Name" name="firstName" required value={formData.firstName ?? ''} onChange={handleFormChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                        <label className="required">Last Name</label>
                                        <input type="text" placeholder="Enter Last Name" name="lastName" required value={formData.lastName ?? ''} onChange={handleFormChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label>Middle Name</label>
                                    <input type="text" placeholder="Enter Middle Name" name="middleName" value={formData.middleName ?? ''} onChange={handleFormChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label>Suffix</label>
                                    <input type="text" placeholder="Enter Suffix" name="suffix" value={formData.suffix ?? ''} onChange={handleFormChange} />
                                </div>
                            </div>

                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label className="required">Birthdate</label>
                                    <input type="date" placeholder="Enter Birthdate" name="birthdate" required value={formData.birthdate ?? ''} onChange={handleFormChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label className="required">Age</label>
                                    <input type="number" placeholder="Enter Age" name="age" required value={formData.age ?? ''} onChange={handleFormChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label className="required">Weight</label>
                                    <input type="text" placeholder="Enter Weight" name="weight" required value={formData.weight ?? ''} onChange={handleFormChange} />
                                </div>
                                <div className="add-doctors-input-box">
                                    <label className="required">Gender</label>
                                    <select name="gender" required className="site-select" value={formData.gender ?? ''} onChange={handleFormChange}>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box"><label className="required">Address</label><input type="text" placeholder="Enter Address" name="address" required value={formData.address ?? ''} onChange={handleFormChange} /></div>
                                <div className="add-doctors-input-box"><label className="required">Street</label><input type="text" placeholder="Enter Street" name="street" required value={formData.street ?? ''} onChange={handleFormChange} /></div>
                            </div>

                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box"><label className="required">Date of Bite</label><input type="date" placeholder="Enter Date of Bite" name="dateOfBite" required value={formData.dateOfBite ?? ''} onChange={handleFormChange} /></div>
                            </div>

                            <h2>Site of Bite</h2>

                            <div className="add-doctors-column site-bite-row">
                                <div className="add-doctors-input-box site-bite-left">
                                    <label>Click a body part</label>
                                    <div className="site-bite-instruction">
                                        <div className="site-bite-caption">Click on a body part to select</div>
                                        <div className="body-figure-box">
                                            <svg viewBox="0 0 120 260" width="100%" height="220" preserveAspectRatio="xMidYMid meet">
                                                <circle cx="60" cy="28" r="18" className={`bf-region ${selectedBodyPart === 'Face' || selectedBodyPart === 'Head' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Face')} />
                                                <rect x="28" y="50" width="64" height="70" rx="4" className={`bf-region ${selectedBodyPart === 'Torso' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Torso')} />
                                                <rect x="4" y="58" width="24" height="16" rx="2" className={`bf-region ${selectedBodyPart === 'Left Arm' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Left Arm')} />
                                                <rect x="4" y="75" width="24" height="16" rx="2" className={`bf-region ${selectedBodyPart === 'Left Arm' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Left Arm')} />
                                                <rect x="92" y="58" width="24" height="16" rx="2" className={`bf-region ${selectedBodyPart === 'Right Arm' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Right Arm')} />
                                                <rect x="92" y="75  " width="24" height="16" rx="2" className={`bf-region ${selectedBodyPart === 'Right Arm' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Right Arm')} />
                                                <rect x="34" y="126" width="18" height="72" rx="2" className={`bf-region ${selectedBodyPart === 'Left Leg' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Left Leg')} />
                                                <rect x="34" y="200" width="18" height="12" rx="2" className={`bf-region ${selectedBodyPart === 'Left Leg' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Left Leg')} />
                                                <rect x="68" y="126" width="18" height="72" rx="2" className={`bf-region ${selectedBodyPart === 'Right Leg' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Right Leg')} />
                                                <rect x="68" y="200" width="18" height="12" rx="2" className={`bf-region ${selectedBodyPart === 'Right Leg' ? 'selected' : ''}`} onClick={() => handleBodyPartClick('Right Leg')} />
                                            </svg>
                                        </div>
                                    </div>

                                    <label className="required">Specific Location</label>
                                    <select name="specificLocation" value={selectedSpecificLocation} onChange={(e) => { setSelectedSpecificLocation(e.target.value); handleFormChange(e); }} className="site-select" required>
                                        <option value="">Select specific location</option>
                                        {specificLocations.map((loc) => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>

                                </div>

                                <div className="add-doctors-input-box site-bite-right">
                                    <div className="add-doctors-input-box">
                                        <label className="required">Is the animal vaccinated?</label>
                                        <select name="isVaccinated" required className="site-select" value={formData.isVaccinated ?? ''} onChange={handleFormChange}>
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>

                                    <div className="add-doctors-input-box">
                                        <label className="required">Category of Exposure</label>
                                        <select name="categExpo" required className="site-select" value={formData.categExpo ?? ''} onChange={handleFormChange}>
                                            <option value="">Select</option>
                                            <option value="categ2">Category II</option>
                                            <option value="categ3">Category III</option>
                                        </select>
                                    </div>

                                    <div className="add-doctors-input-box">
                                        <label className="required">Place Bitten</label>
                                        <select name="placeBitten" required className="site-select" value={formData.placeBitten ?? ''} onChange={handleFormChange}>
                                            <option value="">Select</option>
                                            <option value="house">House</option>
                                            <option value="street">Street</option>
                                            <option value="neighbor">Neighbor</option>
                                            <option value="compound">Compound</option>
                                            <option value="others">Others</option>
                                        </select>
                                    </div>
                                    
                                </div>
                            </div>

                            <h2>Post Exposure Treatment</h2>
                            <div className="add-doctors-column">
                             <div className="add-doctors-input-box">
                                        <label className="required">Post Exposure Treatment</label>
                                        <select name="postExposureTreatment" required className="site-select" onChange={(e) => { handlePostExposureChange(e); handleFormChange(e); }} value={formData.postExposureTreatment ?? ''}>
                                            <option value="">Select</option>
                                            <option value="soap">Wounds washed with soap & water</option>
                                            <option value="disinfect">Applied disinfectant</option>
                                            <option value="tandok">Tandok</option>
                                            <option value="garlic">Used garlic</option>
                                            <option value="none">None</option>
                                            <option value="others">Others</option>

                                        </select>
                                    </div>
                            {showOthers && (
                                     <div className="add-doctors-input-box">
                                        <label className="required">Please Specify</label>
                                        <input ref={postExposureSpecifyRef} type="text" name="postExposureSpecify" required className="site-select" value={formData.postExposureSpecify ?? ''} onChange={handleFormChange} />
                                    </div>
                            )}
                            </div>

                            <h2>Anti-Tetanus Immunization Given</h2>

                                <div className="add-doctors-column">

                                    <div className="add-doctors-input-box">
                                        <label className="required">Anti-Tetanus Immunization Given</label>
                                        <select name="Anti-Tetanus" required className="site-select" value={formData['Anti-Tetanus'] ?? ''} onChange={handleFormChange}>
                                            <option value="">Select</option>
                                            <option value="yes">ATS/TIG</option>
                                            <option value="no">Tetanus Taxoid</option>
                                        </select>
                                    </div>

                                    <div className="add-doctors-input-box">
                                        <label className="required">Please Specify</label>
                                                                                <input type="text" name="AntiTetaSpecify" required className="site-select" value={formData.AntiTetaSpecify ?? ''} onChange={handleFormChange} />
                                    </div>

                                      <div className="add-doctors-input-box">
                                        <label className="required">Date</label>
                                                                                <input type="Date" name="AntiTetaDate" required className="site-select" value={formData.AntiTetaDate ?? ''} onChange={handleFormChange} />
                                    </div>

                                      <div className="add-doctors-input-box">
                                        <label className="required">Where</label>
                                                                                <input type="text" name="AntiTetaWhere" required className="site-select" value={formData.AntiTetaWhere ?? ''} onChange={handleFormChange} />
                                    </div>
                                </div>

                                <div className="add-doctors-column">
                             <div className="add-doctors-input-box">
                             <label className="required">Antibiotics Given</label>    
                             <input type="text" placeholder="Enter Antibiotics Given" name="AntiBioticsGiven" required className="site-select" value={formData.AntiBioticsGiven ?? ''} onChange={handleFormChange} />
                         </div>   
                                </div>

                            <h2>Anti-Tetanus Immunization Given</h2>
                            <h3>Active Immunization</h3>

                            <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label className="required">Active Immunization</label>
                                        <select name="activeImmunization" required className="site-select" onChange={(e) => { handleActiveImmunizationChange(e); handleFormChange(e); }} value={formData.activeImmunization ?? ''}>
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>

                                    {/* <div className="add-doctors-input-box">
                                        <label>Date</label>
                                        <input type="date" name="ActiveImmunizationDate" className="site-select" />
                                    </div> */}

                                    <div className="add-doctors-input-box">
                                        <label className="required">ID/IM</label>
                                        <select name="ID/IM" className="site-select" required value={formData['ID/IM'] ?? ''} onChange={handleFormChange}>
                                            <option value="">Select</option>
                                            <option value="PCEC">PCEC</option>
                                            <option value="Other">PVRV</option>
                                        </select>
                                    </div>

                            </div>
                        {ShowActiveImmunenization && (

                            <div className="add-doctors-column">
                               
                                <div className="add-doctors-input-box">
                                    <label className="required">If yes, date given</label>
                                        <select type="date" placeholder="D0" name="D0" className="site-select" required value={formData.D0 ?? ''} onChange={handleFormChange}>
                                        <option value="">Select</option>
                                        <option value="D0">D0</option>
                                        <option value="D3">D3</option>
                                        <option value="D7">D7</option>
                                        <option value="D30">D30</option>
                                    </select>
                                </div>
                            </div> 
                        )}

                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                    <label className="required">PREVIOUS ARV VACC</label>
                                    <input type="text" name="PrevArvVacc" placeholder="Previous ARV Vacc" required className="site-select" value={formData.PrevArvVacc ?? ''} onChange={handleFormChange} />
                                            
                                       
                                </div>

                                <div className="add-doctors-input-box">
                                    <label className="required">When</label>
                                    <input type="date" name="PrevArvVaccDate" className="site-select" required value={formData.PrevArvVaccDate ?? ''} onChange={handleFormChange} />
                                </div>

                                <div className="add-doctors-input-box">
                                    <label className="required">Vacc</label>
                                    <input type="text" placeholder="Enter Vacc" name="Vacc" className="site-select" required value={formData.Vacc ?? ''} onChange={handleFormChange} />
                                </div>
                            </div>


                             <h3>Passive Immunization</h3>
                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label className="required">Passive Immunization</label>
                                        <select name="passiveImmunization" required className="site-select" value={formData.passiveImmunization ?? ''} onChange={handleFormChange}>
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>

                                    <div className="add-doctors-input-box">
                                        <label className="required">Date</label>
                                        <input type="date" name="PassiveImmunizationDate" className="site-select" required value={formData.PassiveImmunizationDate ?? ''} onChange={handleFormChange} />
                                    </div> 
                                </div>

                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label className="required">Type of Immunoglobulin</label>
                                        <select name="typeOfImmunoglobulin" required className="site-select" value={formData.typeOfImmunoglobulin ?? ''} onChange={handleFormChange}>
                                            <option value="">Select</option>
                                            <option value="hrig">HRIG</option>
                                            <option value="erig">ERIG</option>
                                        </select>
                                    </div>

                                    <div className="add-doctors-input-box">
                                        <label className="required">ml. 40i.u/kg body weight</label>
                                        <input type="text" placeholder="" name="SpecifyTypeofImmuno" className="site-select" required value={formData.SpecifyTypeofImmuno ?? ''} onChange={handleFormChange} />
                                    </div>

                                    <div className="add-doctors-input-box">
                                        <label className="required">Date</label>
                                        <input type="date" placeholder="Date" name="TypeofImmunoDate" className="site-select" required value={formData.TypeofImmunoDate ?? ''} onChange={handleFormChange} />
                                    </div>

                                    <div className="add-doctors-input-box">
                                        <label className="required">Where</label>
                                        <input type="text" placeholder="Where" name="whereGivenImmuno" className="site-select" required value={formData.whereGivenImmuno ?? ''} onChange={handleFormChange} />
                                    </div>
                                </div>

                            <h2>Animal Profile</h2>

                                <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label className="required">Type of Animal</label>
                                        <select name="typeOfAnimal" required className="site-select" onChange={(e) => { handleTypeOfAnimalChange(e); handleFormChange(e); }} value={formData.typeOfAnimal ?? ''}>
                                            <option value="">Select</option>
                                            <option value="dog">Dog</option>
                                            <option value="cat">Cat</option>
                                            <option value="monkey">Monkey</option>
                                            <option value="others">Others</option>
                                        </select>
                                    </div>

                                    {showTypeOfAnimalOthers && (
                                        <div className="add-doctors-input-box">
                                            <label className="required">Please specify</label>
                                            <input ref={typeOfAnimalSpecifyRef} type="text" placeholder="Specify" name="specifyTypeOfAnimal" className="site-select" required value={formData.specifyTypeOfAnimal ?? ''} onChange={handleFormChange} />
                                        </div>
                                    )}  </div>
                            <h3>Containment and Ownership Status</h3>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                        <label className="required">Age</label>
                    <input type="text" placeholder="Age" name="ageOwner" className="site-select" required value={formData.ageOwner   ?? ''} onChange={handleFormChange} />
                                </div>

                                <div className="add-doctors-input-box">
                                        <label className="required">Containment</label>
                                        <select name="containment" required className="site-select" value={formData.containment ?? ''} onChange={handleFormChange}>
                                            <option value="">Select</option>
                                            <option value="dog">Leashed</option>
                                            <option value="cat">Unleashed</option>
                                            <option value="cage">Cage</option>
                                            <option value="stray">Stray</option>
                                        </select>
                                </div>

                                <div className="add-doctors-input-box">
                                        <label className="required">Name of Owner</label>
                                        <input type="text" placeholder="Name of Owner" name="nameOfOwner" className="site-select" required value={formData.nameOfOwner ?? ''} onChange={handleFormChange} />
                                </div>
                            </div>    

                            <div className="add-doctors-column">
                                    <div className="add-doctors-input-box">
                                        <label className="required">Is the animal vaccinated?</label>
                                        <select name="isVaccinated" required className="site-select" onClick={handleSpecifyVaccineChange}>
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                {showSpecifyVaccine && (
                                   <> 
                                    <div className="add-doctors-input-box">
                                        <label className="required">Date</label>
                                        <input type="date" name="date" className="site-select" required/>
                                    </div>

                                    <div className="add-doctors-input-box">
                                        <label className="required">Type of Vaccine</label>
                                        <input type="text" placeholder="Enter Type of Vaccine" name="typeOfVaccine" className="site-select" required/>
                                    </div></>
                                )}
                            </div>

                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                    <label className="required">In contact w/ other animal?</label>
                                        <select name="isInContactWithOtherAnimal" required className="site-select" onClick={handleSpecifyContactChange}>
                                            <option value="">Select</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                </div>
                            {showSpecifyContact && (
                                <>
                                    <div className="add-doctors-input-box">
                                    <label className="required">If yes, specify</label>
                                    <input ref={specifyContactRef} type="text" placeholder="Specify" name="specify" required className="site-select"/></div>
                                    <div className="add-doctors-input-box"><label className="required">How many?</label><input type="text" placeholder="Enter How Many" name="howMany" required className="site-select" /></div>
                                </>   
                            )}
                            </div>

                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                <label className="required">Condition before the bite</label>
                                        <select name="isAnimalDead" required className="site-select">
                                            <option value="">Select</option>
                                            <option value="healthy">Healthy</option>
                                            <option value="sick">Sick</option>
                                            <option value="unknown">Unknown</option>

                                        </select>
                                </div>
                                <div className="add-doctors-input-box">
                                <label className="required">Is the animal dead?</label>
                                <select name="isAnimalDead" required className="site-select">
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                                </div>

                                <div className="add-doctors-input-box">
                                <label className="required">When</label>
                                <input type="date" name="date" required /></div>
                            </div>

                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box">
                                <label className="required">Cause of Death</label>

                                 <select name="isAnimalDead" required className="site-select">
                                            <option value="">Select</option>
                                            <option value="sick">Sick</option>
                                            <option value="slaughtered">Slaughtered</option>
                                            <option value="dead">Found dead</option>
                                            <option value="accident">Accident</option>

                                </select>
                            </div>
                                <div className="add-doctors-input-box">
                                  <label className="required">If rabies are present, what are the clinical manifestation observed?</label>
                                        <input type="text" placeholder="Enter Clinical Manifestation" name="clinicalManifestation" required />
                                </div>
                            </div>

                            <h2>Animal Status (14 days observation)</h2>
                            <div className="add-doctors-column">
                                <div className="add-doctors-input-box"><label className="required">Animal Status</label><input type="text" placeholder="Enter Animal Status" name="animalStatus" required /></div>
                                <div className="add-doctors-input-box"><label className="required">Date</label><input type="date" name="date" required /></div>
                            </div>

                            <div className="add-doctors-buttons">
                                <button className="add-doctors-save-button" >Save</button>
                                <button className="add-doctors-cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View History modal */}
            {viewHistoryModal && (
                <div className="add-doctors-popup-overlay">
                    <div className="add-doctors-popup-content history-popup-content">
                        <div className="add-doctors-popup-header history-popup-header">
                            <h2>Patient Profile</h2>
                            <button className="close-button" onClick={() => setViewHistoryModal(false)}>X</button>
                        </div>

                        <div className="history-popup-body">
                            <div className="history-grid">
                                <div className="history-panel">
                                    <h3>PATIENT PROFILE</h3>
                                    <div className="panel-text">
                                        <div>Patient ID {AnimalBite.patientId}</div>
                                        <div>Full Name {AnimalBite.fullName}</div>
                                        <div>Sex {AnimalBite.sex}</div>
                                        <div>Birth Date {AnimalBite.birthDate}</div>
                                        <div>Age {AnimalBite.age}</div>
                                        <div>Contact No. {AnimalBite.contactNo}</div>
                                        <div>Emergency Contact Person {AnimalBite.emergencyContactPerson}</div>
                                        <div>Emergency Contact {AnimalBite.emergencyContact}</div>
                                    </div>
                                </div>

                                <div className="history-panel">
                                    <h3>RECENT VISIT</h3>
                                    <div className="panel-text">
                                        <div>Date {AnimalBite.recentVisit.date}</div>
                                        <div>Doctor {AnimalBite.recentVisit.doctor}</div>
                                        <div>BP/PR {AnimalBite.recentVisit.bpPr}</div>
                                        <div>HT/WT {AnimalBite.recentVisit.htWt}</div>
                                        <div>Temperature {AnimalBite.recentVisit.temperature}</div>
                                        <div>Complain {AnimalBite.recentVisit.complain}</div>
                                        <div>Medication {AnimalBite.recentVisit.medication}</div>
                                        <div>Status {AnimalBite.recentVisit.status}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="history-visit-log">
                                <div className="visit-log-top">
                                    <h3 className="" style={{ margin: 0, color: '#0e2946', letterSpacing: 2 }}>ANIMAL BITE PATIENT VISIT LOG</h3>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <button className="visit-log-add" onClick={() => setShowModal(true)}>+</button>
                                        <input type="date" placeholder="Date" className="visit-log-date" />
                                    </div>
                                </div>

                                <div className="visit-log-head">
                                    <div className="visit-log-row">
                                        <div>Date Visit</div>
                                        <div>Doctor</div>
                                        <div>AOG</div>
                                        <div>BP</div>
                                        <div>PR</div>
                                        <div>Height</div>
                                        <div>Weight</div>
                                        <div>Temp</div>
                                        <div>Chief Complain</div>
                                        <div>Diagnosis/Medication</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

    export default AnimalBite;
