import { useState, useEffect } from 'react';
import styles from './Settings.module.css';

import axios from 'axios';
import useAuth from '../../../../hooks/useAuth';
import Header from '../../../../shared/components/Header';
import Sidebar from '../../../../components/Sidebar';

import { useToast } from '../../../../hooks/use-toast';
import { getUserById } from '../../api/settingApi';
import ProfileForm from './ProfileForm';
import SecurityForm from './SecurityForm';
import HelpForm from './HelpForm';
import TermsForm from './TermsForm';

const settingsTabs = [
    {
        id: 'profile',
        label: 'Profile Information',
        icon: 'fas fa-user',
    },
    {
        id: 'security',
        label: 'Privacy & Security',
        icon: 'fas fa-lock',
    },
    {
        id: 'help',
        label: 'Help & Support',
        icon: 'fas fa-question-circle',
    },
    {
        id: 'terms',
        label: 'Terms & Conditions',
        icon: 'fas fa-file-contract',
    },
];

export default function Settings() {
    const { auth } = useAuth();
    const { toast } = useToast();

    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        checkUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            const timer = setTimeout(() => {
                fetchUser();
            }, 500);

            // cleanup (important)
            return () => clearTimeout(timer);
        }
    }, [currentUser]);

    const checkUser = async () => {
        if (auth.userId) {
            setCurrentUser(auth.userId);
        }
    };

    const fetchUser = async () => {
        try {
            const data = await getUserById(currentUser);
    
            setUser(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load user data.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                {/* Header */}
                <Header title="Settings" />

                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading settings data...</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.settingsPage}>
                            <div className={styles.settingsTabs}>
                                {settingsTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                         className={`${styles.tabButton} ${
                                            activeTab === tab.id ? styles.active : ''
                                        }`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        <i className={tab.icon}></i>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className={styles.settingsBody}>
                                {activeTab === 'profile' && (
                                    <ProfileForm />
                                )}
                                {activeTab === 'security' && (
                                    <SecurityForm />
                                )}
                                {activeTab === 'help' && (
                                    <HelpForm />
                                )}
                                {activeTab === 'terms' && (
                                    <TermsForm />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}