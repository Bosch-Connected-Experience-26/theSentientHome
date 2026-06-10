export const riskCopy = {
  Low: {
    label: 'Low risk',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    dot: 'bg-emerald-500'
  },
  Medium: {
    label: 'Medium risk',
    className: 'bg-amber-50 text-amber-700 border-amber-100',
    dot: 'bg-amber-500'
  },
  High: {
    label: 'High risk',
    className: 'bg-orange-50 text-orange-700 border-orange-100',
    dot: 'bg-orange-500'
  },
  Critical: {
    label: 'Critical risk',
    className: 'bg-red-50 text-red-700 border-red-100',
    dot: 'bg-red-600'
  }
};

export function evaluateActionRisk({ actorRole, actorAge, deviceCategory, action, adultPresent, kidsSafetyMode }) {
  const isChild = actorRole === 'Child' || actorAge < 13;
  const cooking = deviceCategory === 'Cooking' || action?.toLowerCase().includes('stove');

  if (isChild && cooking && kidsSafetyMode && !adultPresent) {
    return {
      riskLevel: 'Critical',
      decision: 'Block',
      reason: 'Child attempted a critical cooking action without adult presence while Kids Safety Mode is active.'
    };
  }

  if (cooking) {
    return {
      riskLevel: 'High',
      decision: 'Require approval',
      reason: 'Cooking appliances always require adult approval.'
    };
  }

  return {
    riskLevel: 'Low',
    decision: 'Allow or suggest',
    reason: 'Action is within low-risk automation limits.'
  };
}
