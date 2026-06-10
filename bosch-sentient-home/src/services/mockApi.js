import {
  aiActions,
  chatSeedMessages,
  consentSettings,
  defaultDashboardWidgets,
  devices,
  explanations,
  familyMembers,
  homeOverview,
  modes,
  preferences,
  rooms,
  safetyEvents
} from '../data/mockData';

const clone = (value) => JSON.parse(JSON.stringify(value));
const wait = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));
const agentApiUrl = import.meta.env.VITE_AGENT_API_URL || 'http://localhost:8000';

async function askBackendAssistant(message, context = {}) {
  const response = await fetch(`${agentApiUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      conversation: context.conversation || [],
      context: {
        overview: context.overview,
        actions: context.actions,
        family: context.family
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Agent API returned ${response.status}`);
  }

  return response.json();
}

export const mockApi = {
  async getHomeOverview() {
    await wait();
    return clone(homeOverview);
  },

  async getInsights() {
    await wait();
    return clone({
      comfortScore: homeOverview.comfortScore,
      energyBudget: homeOverview.energyBudget,
      comfortBreakdown: [
        { label: 'Temperature match', score: 28, max: 30 },
        { label: 'Air quality', score: 18, max: 20 },
        { label: 'Humidity', score: 14, max: 15 },
        { label: 'Lighting', score: 12, max: 15 },
        { label: 'Noise', score: 8, max: 10 },
        { label: 'Occupancy fit', score: 7, max: 10 }
      ],
      applianceSavings: [
        { label: 'Dishwasher delay', value: 1.2 },
        { label: 'Window heating guard', value: 0.65 },
        { label: 'Washer spin delay', value: 0.34 },
        { label: 'Empty room eco heat', value: 1.66 }
      ],
      weeklyForecast: [
        { day: 'Mon', spend: 5.4 },
        { day: 'Tue', spend: 6.1 },
        { day: 'Wed', spend: 4.8 },
        { day: 'Thu', spend: 4.3 },
        { day: 'Fri', spend: 5.0 },
        { day: 'Sat', spend: 5.8 },
        { day: 'Sun', spend: 4.6 }
      ]
    });
  },

  async getAlerts() {
    await wait();
    return clone(safetyEvents);
  },

  async getDevices() {
    await wait();
    return clone(devices);
  },

  async getRooms() {
    await wait();
    return clone(rooms);
  },

  async getActions() {
    await wait();
    return clone(aiActions);
  },

  async approveAction(actionId) {
    await wait(180);
    return { actionId, status: actionId === 'action-dishwasher-delay' ? 'Scheduled' : 'Approved' };
  },

  async rejectAction(actionId) {
    await wait(180);
    return { actionId, status: 'Rejected' };
  },

  async getModes() {
    await wait();
    return clone(modes);
  },

  async activateMode(modeId) {
    await wait(180);
    return { modeId, active: true };
  },

  async createCustomMode(modePayload) {
    await wait(240);
    return {
      id: `custom-${Date.now()}`,
      icon: 'Sparkles',
      active: true,
      autonomyLevel: 'Custom',
      notificationLevel: modePayload.notificationLevel || 'Balanced',
      devicesAffected: modePayload.devicesAffected || [],
      rules: modePayload.rules || [],
      ...modePayload
    };
  },

  async getPreferences() {
    await wait();
    return clone(preferences);
  },

  async updatePreferences(nextPreferences) {
    await wait(160);
    return clone(nextPreferences);
  },

  async getConsent() {
    await wait();
    return clone(consentSettings);
  },

  async updateConsent(nextConsent) {
    await wait(160);
    return clone(nextConsent);
  },

  async getFamilyStatus() {
    await wait();
    return clone(familyMembers);
  },

  async getSafetyEvents() {
    await wait();
    return clone(safetyEvents);
  },

  async getExplanation(explanationId) {
    await wait(180);
    return clone(explanations[explanationId]);
  },

  async getDashboardWidgets() {
    await wait(120);
    return clone(defaultDashboardWidgets);
  },

  async askAssistant(message, context = {}) {
    try {
      return await askBackendAssistant(message, context);
    } catch (error) {
      console.warn('Falling back to mock assistant response:', error);
    }

    await wait(360);
    const lower = message.toLowerCase();

    if (lower.includes('stove') || lower.includes('mia') || lower.includes('unsafe')) {
      return {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text:
          'I blocked Mia’s stove activation because Kids Safety Mode is active, she is 7, no adult motion was detected in the kitchen, and your calendar showed you were in a meeting. I can keep it blocked, call Mia, or show the sensor context.',
        suggestedActions: ['Show why', 'Call child', 'Keep blocked']
      };
    }

    if (lower.includes('meeting') || lower.includes('focus')) {
      return {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text:
          'Focus Mode is active. I warmed your office to 22°C, paused the washer spin cycle, and kept child safety alerts enabled so critical events can still reach you.',
        suggestedActions: ['Open Focus Mode', 'Show actions']
      };
    }

    if (lower.includes('budget') || lower.includes('energy') || lower.includes('dishwasher')) {
      return {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text:
          'You are at 82% of your monthly energy budget. The best immediate saving is to run the dishwasher at 21:30 when prices drop, and to close or compensate for the open kitchen window.',
        suggestedActions: ['Approve dishwasher delay', 'Open insights']
      };
    }

    if (lower.includes('prepare') || lower.includes('home')) {
      return {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text:
          'I can prepare the home by activating Focus Mode, keeping Kids Safety active, delaying flexible appliances, and monitoring the open kitchen window. Medium-risk appliance starts will still ask for approval.',
        suggestedActions: ['Activate Focus', 'Review approvals']
      };
    }

    return {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text:
        'I’m monitoring comfort, safety, energy, appliances, and routines. Ask me why an action happened, prepare a mode, or explain the current home context.',
      suggestedActions: ['Show Today summary', 'Explain safety rules']
    };
  },

  getChatSeed() {
    return clone(chatSeedMessages);
  }
};
