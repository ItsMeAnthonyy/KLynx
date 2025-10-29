import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import ProfileDropdown from "../../components/ProfileDropdown";
import { BiError, BiSearch } from "react-icons/bi";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import styles from "./NurseNotes.module.css";

function NurseNotes() {
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editNote, setEditNote] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost/api/Nurse_Notes.php");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching Notes:", err);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      setMessage({ type: 'error', text: 'Please enter a note' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }
    
    try {
      await axios.post("http://localhost/api/Nurse_Notes.php", {
        note: newNote,
      });
      setNewNote("");
      setShowAddModal(false);
      setMessage({ type: 'success', text: 'Note added successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      fetchNotes();
    } catch (err) {
      console.error("Error adding Notes:", err);
      setMessage({ type: 'error', text: 'Failed to add note' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDeleteNote = async (ID) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    
    try {
      await axios.delete("http://localhost/api/Nurse_Notes.php", { 
        data: { ID }
      });
      setMessage({ type: 'success', text: 'Note deleted successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      fetchNotes();
    } catch (err) {
      console.error("Error deleting Note:", err);
      setMessage({ type: 'error', text: 'Failed to delete note' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleEditStart = (note) => {
    setEditId(note.ID);
    setEditNote(note.Note);
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editNote.trim()) {
      setMessage({ type: 'error', text: 'Please enter a note' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }
    
    try {
      await axios.put("http://localhost/api/nurse_notes.php", {
        id: editId,
        note: editNote,
      });
      setEditId(null);
      setEditNote("");
      setShowEditModal(false);
      setMessage({ type: 'success', text: 'Note updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      fetchNotes();
    } catch (err) {
      console.error("Error updating Note:", err);
      setMessage({ type: 'error', text: 'Failed to update note' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // Filter notes based on search
  const filteredNotes = notes.filter(note =>
    note.Note.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Nurse Notes Manager</h1>
            <p className={styles.subtitle}>Manage and organize nurse notes</p>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.emergencyButton}>
              <BiError size={20} />
              EMERGENCY MODE
            </button>
            <ProfileDropdown />
          </div>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        {/* Search and Add Section */}
        <div className={styles.searchSection}>
          <div className={styles.searchBar}>
            <div className={styles.searchInputWrapper}>
              <BiSearch className={styles.searchIcon} size={20} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.addButtonContainer}>
            <button 
              className={styles.addButton}
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus size={16} />
              Add Note
            </button>
          </div>
        </div>

        {/* Notes Table */}
        <div className={styles.tableSection}>
          <h3 className={styles.tableTitle}>Nurse Notes</h3>
          <p className={styles.tableSubtitle}>
            Showing {filteredNotes.length} of {notes.length} notes
          </p>
          
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotes.length === 0 ? (
                <tr>
                  <td colSpan="3" className={styles.emptyMessage}>
                    No notes found
                  </td>
                </tr>
              ) : (
                filteredNotes.map((note, index) => (
                  <tr key={note.ID}>
                    <td className={styles.indexCell}>{index + 1}</td>
                    <td className={styles.noteCell}>{note.Note}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.editBtn}
                          onClick={() => handleEditStart(note)}
                          title="Edit Note"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => handleDeleteNote(note.ID)}
                          title="Delete Note"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Note Modal */}
        {showAddModal && (
          <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Add New Note</h2>
                <button 
                  className={styles.closeButton} 
                  onClick={() => setShowAddModal(false)}
                >
                  ×
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Note <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    className={styles.formTextarea}
                    placeholder="Enter nurse note (e.g., Low BMI, Patient needs monitoring)"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button 
                  className={styles.cancelBtn} 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={styles.saveBtn}
                  onClick={handleAddNote}
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Note Modal */}
        {showEditModal && (
          <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Edit Note</h2>
                <button 
                  className={styles.closeButton} 
                  onClick={() => setShowEditModal(false)}
                >
                  ×
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Note <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    className={styles.formTextarea}
                    placeholder="Enter nurse note"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button 
                  className={styles.cancelBtn} 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={styles.saveBtn}
                  onClick={handleEditSave}
                >
                  Update Note
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default NurseNotes;
