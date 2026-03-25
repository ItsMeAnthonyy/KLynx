import axios from "axios";

const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export async function getDiseaseReportData(year, month = null) {
    try {
        const startDate = month
            ? `${year}-${String(month).padStart(2, "0")}-01`
            : `${year}-01-01`;
        
        const endDate = month
            ? new Date(year, month, 0).toISOString().split("T")[0] + " 23:59:59"
            : `${year}-12-31 23:59:59`;

        console.log(startDate, endDate);
        const response = await axios.get("http://localhost/api/get_disease_report_data.php", {
            params: { startDate, endDate }
        });
        console.log(response.data.data);
        return response.data.data;
        
    } catch (error) {
        console.error('Error fetching disease report data:', error);
        throw error;
    }
}

export function processDiseaseData(visits, filterBarangay = null, filterSex = null) {
    const diseaseCount = {};
    const diseaseByBarangay = {};
    const diseaseBySex = {};
    const diseaseByAgeGroup = {};
    const monthlyData = {};

    if (filterBarangay) { console.log("FILTERBARANGAY: ", visits); }
    visits.forEach(visit => {
        if (!visit.PatientID) return;
        if (!visit.diagnosis && !visit.diagnosis_specify) return;
        let diagnoses = [];
        if (visit.icd10_a) { 
            diagnoses.push(visit.icd10_a); // ICD-10 code 
        }
        if (diagnoses.length === 0 && visit.diagnosis_specify) { 
            diagnoses.push(visit.diagnosis_specify); // narrative text 
        }
        console.log("ICD:" ,visit.icd10_a);
        const barangay = visit.Barangay || "Unknown";
        const sex = visit.Sex || "Unknown";


        // Apply filters
        if (filterBarangay && barangay !== filterBarangay) return;
        if (filterSex && sex.toLowerCase() !== filterSex.toLowerCase()) return;

        diagnoses.forEach(diagnosis => {
            if (!diagnosis || diagnosis === "Not Applicable") return;

            // Count by disease 
            diseaseCount[diagnosis] = (diseaseCount[diagnosis] || 0) + 1;
        });

    });

    // Get top 10 diseases
    const top10Diseases = Object.entries(diseaseCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));

    return {
        top10Diseases,
        totalCases: Object.values(diseaseCount).reduce((a, b) => a + b, 0),
    };
}

export async function getDiseaseBarangays() {
    try {
        const res = await axios.get("http://localhost/api/get_disease_barangays.php");
        const brgys = res.data.data || [];
        return brgys.map(b => b.Barangay);
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getAnimalBiteBarangays() {
    try {
        const res = await axios.get("http://localhost/api/get_animalbite_barangays.php");
        const brgys = res.data.data || [];
        return brgys.map(b => b.Barangay);
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getMaternalBarangays() {
    try {
        const res = await axios.get("http://localhost/api/get_maternal_barangays.php");
        const brgys = res.data.data || [];
        return brgys.map(b => b.Barangay);
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Animal Bite Reports
export async function getAnimalBiteReportData(year, month = null) {
    try {
        const startDate = month
            ? `${year}-${String(month).padStart(2, "0")}-01`
            : `${year}-01-01`;
        
        const endDate = month
            ? new Date(year, month, 0).toISOString().split("T")[0] + " 23:59:59"
            : `${year}-12-31 23:59:59`;

        console.log("Start Date and End Date: ",startDate, endDate);
        const response = await axios.get("http://localhost/api/get_animalbite_report_data.php", {
            params: { startDate, endDate }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching animal bite report data:', error);
        throw error;
    }
}

export function processAnimalBiteData(records, filterBarangay = null, filterSex = null, filterAgeGroup = null) {
    const byAnimalType = {};
    const byBarangay = {};
    const byAgeGroup = {};
    const bySex = {};
    const monthlyData = {};
    
    records.forEach(record => {
        if (!record.PatientID) return;
        const animalType = record.species || "Unknown";
        const barangay = record.Barangay || "Unknown";
        const sex = record?.Sex || 'Unknown';
        const age = calculateAge(record.Birthdate);
        const ageGroup = getFormsAgeGroup(age);

        // Apply filters
        if (filterBarangay && barangay !== filterBarangay) return;
        if (filterSex && sex.toLowerCase() !== filterSex.toLowerCase()) return;

        // By animal type
        if (!byAnimalType[animalType]) {
            byAnimalType[animalType] = {
                total: 0,
                newCases: 0,
                underTreatment: 0,
                recovered: 0,
                deaths: 0
            };
        }
        byAnimalType[animalType].total++;

        // By age group
        byAgeGroup[ageGroup] = (byAgeGroup[ageGroup] || 0) + 1;
    });

    const totalCases = Object.values(byAnimalType).reduce((sum, type) => sum + type.total, 0);
    
    return {
        byAnimalType,
        byAgeGroup,
        totalCases
    };
}

// Get yearly overview data
export async function getYearlyOverview(year, filterBarangay = null, filterSex = null) {
    try {
        const visits = await getDiseaseReportData(year);
        const monthlyOverview = {};
        console.log("VISITS??", visits);

        for (let month = 1; month <= 12; month++) {
            const monthVisits = visits.filter(v => {
                const visitMonth = new Date(v.visit_date_time).getMonth() + 1;
                return visitMonth === month;
            });

            const processed = processDiseaseData(monthVisits, filterBarangay, filterSex);
            monthlyOverview[month] = {
                top10: processed.top10Diseases,
                totalCases: processed.totalCases,
            };
        }

        return monthlyOverview;
    } catch (error) {
        console.error('Error fetching yearly overview:', error);
        throw error;
  }
}

// Forms Report - age groups for forms
const getFormsAgeGroup = (age) => {
    if (age === null || age < 0) return 'Unknown';
    if (age <= 17) return '0-17';
    if (age <= 40) return '18-40';
    if (age <= 59) return '41-59';
    return '60+';
};

export function processDiseaseForms(visits, filterBarangay = null, filterSex = null) {
    const diagnosisMap = {};
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    visits.forEach(visit => {
        if (!visit.PatientID) return;
        if (!visit.diagnosis && !visit.diagnosis_specify) return;

        // Apply filters
        const barangay = visit.Barangay || '';
        const sex = visit.Sex || 'Unknown';
        if (filterBarangay && barangay !== filterBarangay) return;
        if (filterSex && sex.toLowerCase() !== filterSex.toLowerCase()) return;


        let diagnoses = [];
        if (visit.icd10_a) { 
            diagnoses.push(visit.icd10_a); // ICD-10 code 
        }
        if (diagnoses.length === 0 && visit.diagnosis_specify) { 
            diagnoses.push(visit.diagnosis_specify); // narrative text 
        }
        const age = calculateAge(visit.Birthdate);
        const formsAgeGroup = getFormsAgeGroup(age);

        // ✅ SAFER DATE COMPARISON
        const visitDateStr = visit.visit_date_time.split(' ')[0];
        const isNewCase = visitDateStr === todayStr;

        diagnoses.forEach(diagnosis => {
            if (!diagnosis || diagnosis === 'not_applicable') return;
            if (!diagnosisMap[diagnosis]) {
                diagnosisMap[diagnosis] = { total: 0, newCases: 0, '0-17': 0, '18-40': 0, '41-59': 0, '60+': 0 };
            }
            diagnosisMap[diagnosis].total++;
            if (formsAgeGroup !== 'Unknown') {
                diagnosisMap[diagnosis][formsAgeGroup]++;
            }
            if (isNewCase) diagnosisMap[diagnosis].newCases++;
        });
    });
    
    return Object.entries(diagnosisMap)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.total - a.total);
}

// ============ Maternal / Prenatal Reports ============

const getPrenatalAgeGroup = (age) => {
    if (age === null || age < 0) return 'Unknown';
    if (age < 18) return 'Under 18';
    if (age <= 25) return '18-25';
    if (age <= 30) return '26-30';
    if (age <= 35) return '31-35';
    return '36+';
};

export async function getPrenatalReportData(year, month = null) {
    try {
        const startDate = month
            ? `${year}-${String(month).padStart(2, "0")}-01`
            : `${year}-01-01`;
        
        const endDate = month
            ? new Date(year, month, 0).toISOString().split("T")[0] + " 23:59:59"
            : `${year}-12-31 23:59:59`;

        console.log(startDate, endDate);
        const response = await axios.get("http://localhost/api/get_maternal_report_data.php", {
            params: { startDate, endDate }
        });
        console.log(response.data.data);
        return response.data.data;
        
    } catch (error) {
        console.error('Error fetching prenatal report data:', error);
        throw error;
    }
}

export function processPrenatalData(visits, filterBarangay = null, filterSex = null) {
    const byAgeGroup = {};
    const byBarangay = {};
    const monthlyData = {};
    let totalCheckups = 0;

    visits.forEach(visit => {
        if (!visit.PatientID) return;

        const barangay = visit.Barangay || "Unknown";
        const sex = visit?.Sex || 'Unknown';

        if (filterBarangay && barangay !== filterBarangay) return;

        totalCheckups++;

        const age = calculateAge(visit.Birthdate);
        const ageGroup = getPrenatalAgeGroup(age);
        const visitMonth = new Date(visit.visit_date_time).getMonth() + 1;

        // By age group
        byAgeGroup[ageGroup] = (byAgeGroup[ageGroup] || 0) + 1;

        // By barangay
        byBarangay[barangay] = (byBarangay[barangay] || 0) + 1;

        // Monthly
        monthlyData[visitMonth] = (monthlyData[visitMonth] || 0) + 1;
    });

    return {
        totalCheckups,
        byAgeGroup,
        byBarangay,
        monthlyData,
    };
}