import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AssistantOrb from './components/AssistantOrb';
import BottomNav from './components/BottomNav';
import DashboardCustomizer from './components/DashboardCustomizer';
import ExplainabilityModal from './components/ExplainabilityModal';
import ModeBuilderModal from './components/ModeBuilderModal';
import SafetyAlertModal from './components/SafetyAlertModal';
import TopBar from './components/TopBar';
import ActionsPage from './pages/ActionsPage';
import AssistantPage from './pages/AssistantPage';
import DevicesPage from './pages/DevicesPage';
import InsightsPage from './pages/InsightsPage';
import ModesPage from './pages/ModesPage';
import SafetyPage from './pages/SafetyPage';
import SettingsPage from './pages/SettingsPage';
import TodayPage from './pages/TodayPage';
import { defaultDashboardWidgets } from './data/mockData';
import { mockApi } from './services/mockApi';

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [previousTab, setPreviousTab] = useState('today');
  const [overview, setOverview] = useState(null);
  const [family, setFamily] = useState([]);
  const [actions, setActions] = useState([]);
  const [devices, setDevices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [insights, setInsights] = useState(null);
  const [modes, setModes] = useState([]);
  const [consent, setConsent] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [safetyEvents, setSafetyEvents] = useState([]);
  const [widgets, setWidgets] = useState(defaultDashboardWidgets);
  const [messages, setMessages] = useState(mockApi.getChatSeed());
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [modeBuilderOpen, setModeBuilderOpen] = useState(false);
  const [safetyAlertOpen, setSafetyAlertOpen] = useState(false);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [activeExplanation, setActiveExplanation] = useState(null);
  const [listening, setListening] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function load() {
      const [home, people, actionList, deviceList, roomList, insightData, modeList, consentData, preferenceData, safetyData, widgetData] = await Promise.all([
        mockApi.getHomeOverview(),
        mockApi.getFamilyStatus(),
        mockApi.getActions(),
        mockApi.getDevices(),
        mockApi.getRooms(),
        mockApi.getInsights(),
        mockApi.getModes(),
        mockApi.getConsent(),
        mockApi.getPreferences(),
        mockApi.getSafetyEvents(),
        mockApi.getDashboardWidgets()
      ]);
      setOverview(home);
      setFamily(people);
      setActions(actionList);
      setDevices(deviceList);
      setRooms(roomList);
      setInsights(insightData);
      setModes(modeList);
      setConsent(consentData);
      setPreferences(preferenceData);
      setSafetyEvents(safetyData);
      setWidgets(widgetData);
      setLoading(false);
    }
    load();
  }, []);

  const primarySafetyEvent = safetyEvents[0];

  const openExplanation = async (explanationId) => {
    const explanation = await mockApi.getExplanation(explanationId);
    setActiveExplanation(explanation);
    setExplanationOpen(true);
    setSafetyAlertOpen(false);
  };

  const approveAction = async (actionId) => {
    const response = await mockApi.approveAction(actionId);
    setActions((current) => current.map((action) => (action.id === actionId ? { ...action, status: response.status } : action)));
    showToast(response.status === 'Scheduled' ? 'Action scheduled successfully.' : 'Action approved.');
  };

  const rejectAction = async (actionId) => {
    const response = await mockApi.rejectAction(actionId);
    setActions((current) => current.map((action) => (action.id === actionId ? { ...action, status: response.status } : action)));
    showToast('Action rejected.');
  };

  const activateMode = async (modeId) => {
    await mockApi.activateMode(modeId);
    setModes((current) => current.map((mode) => (mode.id === modeId ? { ...mode, active: true } : mode)));
    showToast('Mode activated.');
  };

  const createCustomMode = async (payload) => {
    const newMode = await mockApi.createCustomMode(payload);
    setModes((current) => [newMode, ...current]);
    showToast('Custom mode created and activated.');
  };

  const toggleConsent = async (id) => {
    const next = consent.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item));
    setConsent(next);
    await mockApi.updateConsent(next);
  };

  const updatePreference = async (section, key, value) => {
    const next = {
      ...preferences,
      [section]: {
        ...preferences[section],
        [key]: value
      }
    };
    setPreferences(next);
    await mockApi.updatePreferences(next);
  };

  const toggleWidget = (id) => {
    setWidgets((current) => current.map((widget) => (widget.id === id ? { ...widget, visible: !widget.visible } : widget)));
  };

  const pinWidget = (id) => {
    setWidgets((current) => current.map((widget) => (widget.id === id ? { ...widget, pinned: !widget.pinned, visible: true } : widget)));
  };

  const moveWidget = (index, direction) => {
    setWidgets((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const askAssistant = async (text) => {
    const userMessage = { id: `user-${Date.now()}`, role: 'user', text };
    setMessages((current) => [...current, userMessage]);
    const assistantMessage = await mockApi.askAssistant(text, { overview, actions, family });
    setMessages((current) => [...current, assistantMessage]);
  };

  const toggleVoice = () => {
    setListening((current) => !current);
    if (!listening) {
      setTimeout(() => {
        setListening(false);
        askAssistant('Prepare the home for my meeting and keep the kids safe.');
      }, 1100);
    }
  };

  const navigate = (tab) => {
    setPreviousTab(activeTab);
    setActiveTab(tab);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 1800);
  };

  const page = useMemo(() => {
    if (!overview || !insights || !preferences) return null;

    const shared = {
      onApprove: approveAction,
      onReject: rejectAction,
      onExplain: openExplanation,
      onNavigate: navigate
    };

    if (settingsOpen) {
      return (
        <SettingsPage
          consent={consent}
          preferences={preferences}
          onToggleConsent={toggleConsent}
          onPreferenceChange={updatePreference}
          onClose={() => setSettingsOpen(false)}
        />
      );
    }

    switch (activeTab) {
      case 'today':
        return (
          <TodayPage
            overview={overview}
            family={family}
            actions={actions}
            widgets={widgets}
            onCustomize={() => setCustomizerOpen(true)}
            {...shared}
          />
        );
      case 'actions':
        return <ActionsPage actions={actions} {...shared} />;
      case 'safety':
        return <SafetyPage family={family} safetyEvents={safetyEvents} onOpenSafetyAlert={() => setSafetyAlertOpen(true)} onExplain={openExplanation} />;
      case 'insights':
        return <InsightsPage insights={insights} rooms={rooms} />;
      case 'assistant':
        return (
          <AssistantPage
            messages={messages}
            onAskAssistant={askAssistant}
            onVoiceToggle={toggleVoice}
            listening={listening}
            onExplainMia={() => openExplanation('explain-mia-stove')}
          />
        );
      case 'devices':
        return <DevicesPage devices={devices} rooms={rooms} />;
      case 'modes':
        return <ModesPage modes={modes} onActivateMode={activateMode} onOpenBuilder={() => setModeBuilderOpen(true)} />;
      default:
        return <TodayPage overview={overview} family={family} actions={actions} widgets={widgets} onCustomize={() => setCustomizerOpen(true)} {...shared} />;
    }
  }, [activeTab, settingsOpen, overview, family, actions, devices, rooms, insights, modes, consent, preferences, widgets, messages, listening]);

  if (loading) {
    return (
      <div className="mobile-shell grid place-items-center">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-[24px] bg-slate-950 text-white shadow-2xl breathe">AI</div>
          <p className="mt-4 text-[13px] font-black uppercase tracking-[0.2em] text-slate-500">Loading Sentient Home</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-shell">
      <TopBar onOpenSettings={() => setSettingsOpen(true)} onTriggerSafety={() => setSafetyAlertOpen(true)} alertCount={overview.openAlerts} />

      <main className="screen-scroll">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          <QuickButton active={activeTab === 'modes'} onClick={() => navigate('modes')}>Modes</QuickButton>
          <QuickButton active={activeTab === 'devices'} onClick={() => navigate('devices')}>Devices & Rooms</QuickButton>
          <QuickButton active={settingsOpen} onClick={() => setSettingsOpen(true)}>Consent</QuickButton>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={settingsOpen ? 'settings' : activeTab}
            initial={{ opacity: 0, x: previousTab === activeTab ? 0 : 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.18 }}
          >
            {page}
          </motion.div>
        </AnimatePresence>
      </main>

      <AssistantOrb onClick={() => navigate('assistant')} listening={listening} />
      <BottomNav activeTab={activeTab} onChange={navigate} />

      <DashboardCustomizer
        open={customizerOpen}
        widgets={widgets}
        onClose={() => setCustomizerOpen(false)}
        onToggle={toggleWidget}
        onPin={pinWidget}
        onMove={moveWidget}
        onReset={() => setWidgets(defaultDashboardWidgets)}
      />

      <ModeBuilderModal open={modeBuilderOpen} onClose={() => setModeBuilderOpen(false)} onCreate={createCustomMode} />

      <SafetyAlertModal
        open={safetyAlertOpen}
        event={primarySafetyEvent}
        onClose={() => setSafetyAlertOpen(false)}
        onExplain={openExplanation}
      />

      <ExplainabilityModal explanation={activeExplanation} open={explanationOpen} onClose={() => setExplanationOpen(false)} />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="absolute bottom-24 left-4 right-4 z-[70] rounded-2xl bg-slate-950 px-4 py-3 text-center text-[13px] font-black text-white shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuickButton({ children, active, onClick }) {
  return (
    <button onClick={onClick} className={`soft-button shrink-0 rounded-full px-4 py-2 text-[11px] font-black shadow-sm ${active ? 'bg-slate-950 text-white' : 'bg-white text-slate-500'}`}>
      {children}
    </button>
  );
}
