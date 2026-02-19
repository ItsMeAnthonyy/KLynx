import axios from "axios";

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

    visits.forEach(visit => {
        if (!visit.PatientID) return;

        if (!visit.diagnosis && !visit.diagnosis_specify) return;

        let diagnoses = [];
        const diagnosisSpecify = visit.diagnosis_specify;
        

        
    })
}

// Get yearly overview data
export async function getYearlyOverview(year) {
    try {
        const visits = await getDiseaseReportData(year);
        const monthlyOverview = {};

        for (let month = 1; month <= 12; month++) {
            const monthVisits = visits.filter(v => {
                const visitMonth = new Date(v.visit_date).getMonth() + 1;
                return visitMonth === month;
            });

            const processed = processDiseaseData(monthVisits);
            monthlyOverview[month] = {
                top10: processed.top10Diseases,
                totalCases: processed.totalCases,
                byAgeGroup: processed.diseaseByAgeGroup,
                byBarangay: processed.diseaseByBarangay,
                bySex: processed.diseaseBySex
            };
        }

        return monthlyOverview;
    } catch (error) {
        console.error('Error fetching yearly overview:', error);
        throw error;
  }
}