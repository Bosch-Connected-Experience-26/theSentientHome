# Bosch Sentient Home — React + Vite + Tailwind Prototype

A polished mobile-first hackathon prototype for **The Sentient Home** challenge.

The prototype demonstrates a context-aware AI home companion for Leila Haddad, a single mother working from home in Berlin. It uses realistic dummy data and a mock API/service layer so it can later connect to Bosch Home Connect, Bosch Smart Home sensors, AWS AgentCore, MongoDB Atlas, weather, calendar, and energy-price services.

## Tech stack

- React
- Vite
- Tailwind CSS via `@tailwindcss/vite`
- Framer Motion
- Lucide React icons
- Mock API service layer

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually:

```bash
http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```

## Key demo interactions

1. Open **Today** to see the full context-aware home overview.
2. Tap the red bell in the top bar or go to **Safety** and trigger the Mia stove safety demo.
3. In the alert, tap **View sensor context** to open the explainability flow.
4. Go to **Actions** and approve or reject AI recommendations.
5. On **Today**, tap **Customize** to add, remove, pin, and reorder dashboard widgets.
6. Tap **Modes** in the quick chips to activate modes or create a custom mode.
7. Tap the settings icon to change consent and preferences.
8. Open **Assistant** and ask: “Why did you block the stove?”

## File structure

```text
bosch-sentient-home/
  index.html
  package.json
  vite.config.js
  README.md
  src/
    main.jsx
    App.jsx
    styles.css
    constants/
      navigation.js
    data/
      mockData.js
    services/
      mockApi.js
    utils/
      riskEngine.js
    components/
      ActionCard.jsx
      AssistantOrb.jsx
      BottomNav.jsx
      Card.jsx
      ConsentToggle.jsx
      ContextChip.jsx
      DashboardCustomizer.jsx
      ExplainabilityModal.jsx
      MetricCard.jsx
      Modal.jsx
      ModeBuilderModal.jsx
      SafetyAlertModal.jsx
      SystemIntelligencePanel.jsx
      TopBar.jsx
    pages/
      ActionsPage.jsx
      AssistantPage.jsx
      DevicesPage.jsx
      InsightsPage.jsx
      ModesPage.jsx
      SafetyPage.jsx
      SettingsPage.jsx
      TodayPage.jsx
```

## Backend integration notes

The app currently imports all data through `src/services/mockApi.js`. Replace mock service methods with real fetch calls when backend endpoints are ready.

Suggested endpoint mapping:

- `mockApi.getHomeOverview()` → `GET /api/home/overview`
- `mockApi.getInsights()` → `GET /api/home/insights`
- `mockApi.getAlerts()` → `GET /api/home/alerts`
- `mockApi.getDevices()` → `GET /api/devices`
- `mockApi.getActions()` → `GET /api/ai/actions`
- `mockApi.approveAction(id)` → `POST /api/ai/actions/:id/approve`
- `mockApi.rejectAction(id)` → `POST /api/ai/actions/:id/reject`
- `mockApi.askAssistant(message)` → `POST /api/assistant/chat`
- `mockApi.getModes()` → `GET /api/modes`
- `mockApi.activateMode(id)` → `POST /api/modes/activate`
- `mockApi.createCustomMode(payload)` → `POST /api/modes/custom`
- `mockApi.getPreferences()` → `GET /api/preferences`
- `mockApi.updatePreferences(payload)` → `PUT /api/preferences`
- `mockApi.getConsent()` → `GET /api/consent`
- `mockApi.updateConsent(payload)` → `PUT /api/consent`
- `mockApi.getFamilyStatus()` → `GET /api/family/status`
- `mockApi.getSafetyEvents()` → `GET /api/safety/events`
- `mockApi.getExplanation(id)` → `GET /api/explanations/:actionId`

For the real version, safety-critical decisions should always be validated server-side. The frontend should never be the only safety gate for actions such as stove activation, oven preheating, or door unlock.

## Demo script

“Today’s smart homes are mostly remote controls. Bosch Sentient Home changes that. Leila opens the app before a meeting, and the home already understands the context: Berlin is cold and rainy, her meeting starts in 12 minutes, the kitchen window is open, the dishwasher is ready, and her energy budget is at 82%.

The AI prepares the office, delays flexible appliances, and keeps Kids Safety Mode active. Every action is explainable: we can open the dishwasher recommendation and see the energy price, budget, appliance state, and rule behind the suggestion.

Now the wow moment: Mia tries to activate the stove while Leila is in a meeting. The system blocks it automatically because Mia is a child, no adult is detected in the kitchen, Kids Safety Mode is active, and Leila’s calendar shows she is busy. The app shows the sensors, the rule, the risk level, and the system intelligence stack: Bosch Home Connect, Bosch Smart Home, AWS AgentCore, MongoDB Atlas, LLM reasoning, and external context.

This is not another dashboard. It is a trusted household intelligence layer: proactive, explainable, safe, and under human control.”
