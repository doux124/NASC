export const DEFAULT_DRIFT = [
  {
    col: 'MonthlyCharges',
    col_type: 'Float',
    drift_description: 'Feature ranges explode in test set (PSI=0.412)',
    drift_score: 0.412,
    is_important: true,
    mitigation: 'Feature Scaling',
  },
  {
    col: 'ContractType',
    col_type: 'Object',
    drift_description:
      'Feature has new set of categorical features in test set compared to training set',
    drift_score: 0.333,
    is_important: true,
    mitigation: 'Seasonality Matching',
  },
  {
    col: 'DataUsageGB',
    col_type: 'Float',
    drift_description: 'Feature demonstrates greater right-skewness in test set (PSI=0.218)',
    drift_score: 0.218,
    is_important: true,
    mitigation: 'Feature Scaling',
  },
  {
    col: 'TenureMonths',
    col_type: 'Int',
    drift_description: 'Feature demonstrates greater left-skewness in test set (PSI=0.162)',
    drift_score: 0.162,
    is_important: false,
    mitigation: 'Drop Feature',
  },
  {
    col: 'PaymentMethod',
    col_type: 'Object',
    drift_description: 'Feature distribution shift detected in test set (chi2 p=0.0023)',
    drift_score: 0.998,
    is_important: false,
    mitigation: 'Drop Feature',
  },
  {
    col: 'CallsPerMonth',
    col_type: 'Int',
    drift_description: 'Feature demonstrates greater right-skewness in test set (PSI=0.11)',
    drift_score: 0.11,
    is_important: false,
    mitigation: 'Drop Feature',
  },
]

export const DEFAULT_METRICS = {
  trainAUPRC: 0.714,
  testAUPRC: 0.725,
  timeTaken: 21.3,
}

export const MITIGATION_OPTIONS = [
  'Feature Scaling',
  'Drop Feature',
  'Seasonality Matching',
  'No Action',
]

export const TYPE_OPTIONS = ['Float', 'Int', 'Object']
