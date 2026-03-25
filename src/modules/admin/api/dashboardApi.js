export function processAnimalBiteDashboardData(records, filterBarangay = null, filterSex = null, filterAgeGroup = null) {
    const byAnimalType = {};
    
    records.forEach(record => {
        if (!record.PatientID) return;
        const animalType = record.species || "Unknown";

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
    });
    
    return {
        byAnimalType
    };
}