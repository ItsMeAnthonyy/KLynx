
import PropTypes from 'prop-types';

export function ConsultationRecord({ record }) {
  const renderAdditionalInfo = () => {
    switch (record.type) {
      case 'prenatal':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Gestational Age</h4>
              <p>{record.additionalInfo.gestationalAge || 'N/A'} weeks</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Fetal Heart Rate</h4>
              <p>{record.additionalInfo.fetalHeartRate || 'N/A'} bpm</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Fundal Height</h4>
              <p>{record.additionalInfo.fundalHeight || 'N/A'} cm</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Next Visit</h4>
              <p>{record.additionalInfo.nextVisit || 'N/A'}</p>
            </div>
          </div>
        );
      case 'dental':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Procedure</h4>
              <p>{record.additionalInfo.procedure || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Tooth Number</h4>
              <p>{record.additionalInfo.toothNumber || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Treatment Plan</h4>
              <p>{record.additionalInfo.treatmentPlan || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Next Visit</h4>
              <p>{record.additionalInfo.nextVisit || 'N/A'}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="consultation-record p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Record #{record.id}</span>
          <span className="text-sm">{record.date}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-4">
        <div>
          <h4 className="text-sm text-muted-foreground mb-1">Blood Pressure</h4>
          <p className="text-lg font-medium">{record.bloodPressure}</p>
        </div>
        <div>
          <h4 className="text-sm text-muted-foreground mb-1">Temperature</h4>
          <p className="text-lg font-medium">{record.temperature}°C</p>
        </div>
        <div>
          <h4 className="text-sm text-muted-foreground mb-1">Pulse</h4>
          <p className="text-lg font-medium">{record.pulse} bpm</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm text-muted-foreground mb-1">Symptoms</h4>
          <p>{record.symptoms}</p>
        </div>
        <div>
          <h4 className="text-sm text-muted-foreground mb-1">Diagnosis</h4>
          <p>{record.diagnosis}</p>
        </div>
      </div>

      {renderAdditionalInfo()}
    </div>
  );
}

ConsultationRecord.propTypes = {
  record: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    date: PropTypes.string.isRequired,
    bloodPressure: PropTypes.string.isRequired,
    temperature: PropTypes.string.isRequired,
    pulse: PropTypes.string.isRequired,
    symptoms: PropTypes.string.isRequired,
    diagnosis: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['general', 'prenatal', 'dental']),
    additionalInfo: PropTypes.shape({
      // Prenatal fields
      gestationalAge: PropTypes.string,
      fetalHeartRate: PropTypes.string,
      fundalHeight: PropTypes.string,
      nextVisit: PropTypes.string,
      // Dental fields
      procedure: PropTypes.string,
      toothNumber: PropTypes.string,
      treatmentPlan: PropTypes.string,
    }),
  }).isRequired,
};