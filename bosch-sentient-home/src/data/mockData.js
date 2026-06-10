export const homeOverview = {
  homeId: 'berlin-haddad-home-01',
  residentName: 'Leila',
  residentFullName: 'Leila Haddad',
  location: 'Berlin, Germany',
  season: 'Winter',
  weather: {
    label: 'Cold rain',
    temperature: 4,
    unit: '°C',
    condition: 'Rainy',
    humidity: 82,
    wind: '18 km/h'
  },
  currentMode: 'Focus / Work Mode',
  nextEvent: {
    title: 'Client sync',
    startsIn: '12 min',
    time: '14:20–15:00'
  },
  summary:
    'Your meeting starts in 12 minutes. I warmed the office, kept Kids Safety active, and delayed the dishwasher to protect your energy budget.',
  comfortScore: 87,
  energyBudget: {
    usedPercent: 82,
    monthlyLimit: 180,
    projectedSpend: 172,
    todaySavings: 3.85,
    weeklyOpportunity: 7.4,
    status: 'Tight but on track'
  },
  kidsSafetyStatus: 'Active',
  pendingApprovals: 2,
  openAlerts: 1,
  applianceCoordination: '3 devices optimized',
  contextChips: ['Winter', 'Rainy 4°C', 'Meeting in 12 min', 'Energy high', 'Budget 82%', 'Kids home']
};

export const familyMembers = [
  {
    id: 'leila',
    name: 'Leila',
    fullName: 'Leila Haddad',
    age: 36,
    role: 'Parent',
    presenceStatus: 'Home',
    currentRoom: 'Office',
    lastSeen: 'Now',
    activity: 'In scheduled work meeting',
    avatar: 'LH',
    permissions: ['all_devices', 'safety_admin', 'automation_admin']
  },
  {
    id: 'adam',
    name: 'Adam',
    age: 11,
    role: 'Child',
    presenceStatus: 'Home',
    currentRoom: 'Kids Room',
    lastSeen: '3 min ago',
    activity: 'Homework mode suggested',
    avatar: 'A',
    permissions: ['lights', 'music'],
    safetyRestrictions: ['no_cooking_appliances', 'no_door_unlock']
  },
  {
    id: 'mia',
    name: 'Mia',
    age: 7,
    role: 'Child',
    presenceStatus: 'Home',
    currentRoom: 'Kitchen',
    lastSeen: '1 min ago',
    activity: 'Near kitchen counter',
    avatar: 'M',
    permissions: ['lights'],
    safetyRestrictions: ['no_cooking_appliances', 'no_door_unlock', 'no_high_heat']
  }
];

export const rooms = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    temperature: 19.5,
    preferredTemperature: 20,
    humidity: 55,
    airQuality: 'Good',
    lighting: 'Warm',
    occupancy: 'Mia detected',
    noise: 'Low',
    windows: [{ id: 'kitchen-window', status: 'Open', openFor: '18 min' }],
    devices: ['Bosch dishwasher', 'Bosch oven', 'Bosch fridge', 'Kitchen motion sensor'],
    alerts: ['Window open while heating is active'],
    recommendation: 'Turn down heating or close window to reduce waste.'
  },
  {
    id: 'office',
    name: 'Office',
    temperature: 22,
    preferredTemperature: 22,
    humidity: 44,
    airQuality: 'Excellent',
    lighting: 'Focus',
    occupancy: 'Leila detected',
    noise: 'Quiet',
    windows: [{ id: 'office-window', status: 'Closed', openFor: null }],
    devices: ['Thermostat', 'Office lights', 'Calendar integration'],
    alerts: [],
    recommendation: 'Focus environment ready.'
  },
  {
    id: 'kids-room',
    name: 'Kids Room',
    temperature: 21,
    preferredTemperature: 21,
    humidity: 47,
    airQuality: 'Good',
    lighting: 'Study',
    occupancy: 'Adam detected',
    noise: 'Medium',
    windows: [{ id: 'kids-window', status: 'Closed', openFor: null }],
    devices: ['Smart lights', 'Motion sensor'],
    alerts: [],
    recommendation: 'Study Mode can reduce distractions.'
  },
  {
    id: 'living-room',
    name: 'Living Room',
    temperature: 20,
    preferredTemperature: 21,
    humidity: 49,
    airQuality: 'Good',
    lighting: 'Soft',
    occupancy: 'Empty',
    noise: 'Low',
    windows: [{ id: 'living-window', status: 'Closed', openFor: null }],
    devices: ['Smart lights', 'Thermostat', 'Air quality sensor'],
    alerts: [],
    recommendation: 'Heating can stay in eco until the room is occupied.'
  }
];

export const devices = [
  {
    id: 'dishwasher',
    name: 'Bosch Dishwasher',
    brand: 'Bosch Home Connect',
    category: 'Dishwasher',
    room: 'Kitchen',
    status: 'Ready',
    capabilities: ['Eco 50°', 'Auto schedule', 'Remote start'],
    currentProgram: 'Eco 50°',
    energyUsage: '0.82 kWh estimated',
    riskLevel: 'Low',
    requiresApproval: false,
    lastEvent: 'Ready at 13:42',
    connectedSource: 'Home Connect API'
  },
  {
    id: 'washer',
    name: 'Bosch Washing Machine',
    brand: 'Bosch Home Connect',
    category: 'Laundry',
    room: 'Bathroom',
    status: 'Paused for meeting',
    capabilities: ['Eco wash', 'Remote start', 'Spin delay'],
    currentProgram: 'Eco 40°',
    energyUsage: '0.61 kWh estimated',
    riskLevel: 'Medium',
    requiresApproval: true,
    lastEvent: 'Spin cycle paused by Focus Mode',
    connectedSource: 'Home Connect API'
  },
  {
    id: 'dryer',
    name: 'Bosch Dryer',
    brand: 'Bosch Home Connect',
    category: 'Laundry',
    room: 'Bathroom',
    status: 'Idle',
    capabilities: ['Auto dry', 'Low heat', 'Remote start'],
    currentProgram: null,
    energyUsage: '1.4 kWh estimated',
    riskLevel: 'Medium',
    requiresApproval: true,
    lastEvent: 'Last used yesterday',
    connectedSource: 'Home Connect API'
  },
  {
    id: 'oven',
    name: 'Bosch Oven / Stove',
    brand: 'Bosch Home Connect',
    category: 'Cooking',
    room: 'Kitchen',
    status: 'Locked by Kids Safety Mode',
    capabilities: ['Preheat', 'Temperature control', 'Safety lock'],
    currentProgram: null,
    energyUsage: 'High when active',
    riskLevel: 'Critical',
    requiresApproval: true,
    lastEvent: 'Unsafe activation blocked',
    connectedSource: 'Home Connect API + safety engine'
  },
  {
    id: 'fridge',
    name: 'Bosch Fridge',
    brand: 'Bosch Home Connect',
    category: 'Fridge/Freezer',
    room: 'Kitchen',
    status: 'Normal',
    capabilities: ['Temperature monitor', 'Door state', 'Eco mode'],
    currentProgram: 'Eco cooling',
    energyUsage: 'Stable',
    riskLevel: 'Low',
    requiresApproval: false,
    lastEvent: 'Door closed 12 min ago',
    connectedSource: 'Home Connect API'
  },
  {
    id: 'coffee',
    name: 'Bosch Coffee Machine',
    brand: 'Bosch Home Connect',
    category: 'Coffee',
    room: 'Kitchen',
    status: 'Ready',
    capabilities: ['Espresso', 'Latte', 'Remote prep'],
    currentProgram: null,
    energyUsage: 'Low',
    riskLevel: 'Medium',
    requiresApproval: true,
    lastEvent: 'Ready for remote preparation',
    connectedSource: 'Home Connect API'
  },
  {
    id: 'thermostat-office',
    name: 'Office Thermostat',
    brand: 'Bosch Smart Home',
    category: 'Heating',
    room: 'Office',
    status: 'Set to 22°C',
    capabilities: ['Heat', 'Eco', 'Presence adjustment'],
    currentProgram: 'Focus comfort',
    energyUsage: 'Moderate',
    riskLevel: 'Low',
    requiresApproval: false,
    lastEvent: 'Adjusted +2°C for meeting',
    connectedSource: 'Bosch Smart Home sensor network'
  },
  {
    id: 'energy-meter',
    name: 'Energy Meter',
    brand: 'Smart Meter',
    category: 'Energy',
    room: 'Utility',
    status: 'Monitoring',
    capabilities: ['Usage tracking', 'Budget forecast', 'Peak detection'],
    currentProgram: 'Budget guard',
    energyUsage: 'Live',
    riskLevel: 'Low',
    requiresApproval: false,
    lastEvent: 'Monthly budget reached 82%',
    connectedSource: 'Energy service'
  }
];

export const aiActions = [
  {
    id: 'action-office-heat',
    title: 'Warm office for Focus Mode',
    description: 'Office was below Leila’s preferred focus temperature. Heating adjusted to 22°C.',
    status: 'Auto-handled',
    riskLevel: 'Low',
    confidence: 94,
    actionType: 'comfort',
    devices: ['Office Thermostat', 'Calendar'],
    rooms: ['Office'],
    reason: 'Meeting starts in 12 minutes and office was below preferred focus temperature.',
    contextUsed: ['Calendar event', 'Room temperature', 'Leila comfort preference', 'Winter weather'],
    requiresApproval: false,
    scheduledFor: null,
    estimatedSavings: null,
    explanationId: 'explain-office-heat'
  },
  {
    id: 'action-dishwasher-delay',
    title: 'Delay dishwasher until lower energy price',
    description: 'Run Eco 50° at 21:30 instead of now to reduce energy cost.',
    status: 'Pending Approval',
    riskLevel: 'Low',
    confidence: 91,
    actionType: 'energy',
    devices: ['Bosch Dishwasher', 'Energy Meter', 'Energy Price API'],
    rooms: ['Kitchen'],
    reason: 'Energy prices drop later and the monthly budget is already at 82%.',
    contextUsed: ['Dishwasher ready', 'Energy price forecast', 'Monthly budget', 'Quiet hours'],
    requiresApproval: true,
    scheduledFor: '21:30',
    estimatedSavings: 1.2,
    explanationId: 'explain-dishwasher-delay'
  },
  {
    id: 'action-window-reminder',
    title: 'Kitchen window open while heating is active',
    description: 'Window has been open for 18 minutes during winter heating.',
    status: 'Suggested',
    riskLevel: 'Low',
    confidence: 88,
    actionType: 'energy',
    devices: ['Kitchen Window Sensor', 'Kitchen Thermostat'],
    rooms: ['Kitchen'],
    reason: 'Open window may waste heat and increase energy use.',
    contextUsed: ['Window sensor', 'Heating state', 'Outdoor temperature', 'Energy budget'],
    requiresApproval: false,
    scheduledFor: null,
    estimatedSavings: 0.65,
    explanationId: 'explain-window-reminder'
  },
  {
    id: 'action-coffee-before-meeting',
    title: 'Prepare coffee before meeting',
    description: 'Coffee machine is ready. This requires approval because it uses a heated appliance.',
    status: 'Pending Approval',
    riskLevel: 'Medium',
    confidence: 76,
    actionType: 'appliance',
    devices: ['Bosch Coffee Machine'],
    rooms: ['Kitchen'],
    reason: 'Leila often prepares coffee before afternoon client syncs.',
    contextUsed: ['Routine memory', 'Calendar', 'Coffee machine ready'],
    requiresApproval: true,
    scheduledFor: 'Now',
    estimatedSavings: null,
    explanationId: 'explain-coffee-before-meeting'
  },
  {
    id: 'action-washer-pause',
    title: 'Pause washer spin during meeting',
    description: 'Spin cycle delayed because the office shares a wall with the bathroom.',
    status: 'Auto-handled',
    riskLevel: 'Low',
    confidence: 89,
    actionType: 'focus',
    devices: ['Bosch Washing Machine', 'Calendar'],
    rooms: ['Bathroom', 'Office'],
    reason: 'Focus Mode reduces noise during scheduled meetings.',
    contextUsed: ['Calendar event', 'Washer cycle state', 'Room adjacency', 'Focus preferences'],
    requiresApproval: false,
    scheduledFor: 'After meeting',
    estimatedSavings: null,
    explanationId: 'explain-washer-pause'
  }
];

export const safetyEvents = [
  {
    id: 'safety-mia-stove',
    timestamp: '14:08',
    person: 'Mia',
    age: 7,
    attemptedAction: 'Activate stove',
    device: 'Bosch Oven / Stove',
    room: 'Kitchen',
    riskLevel: 'Critical',
    blocked: true,
    reason:
      'Kids Safety Mode is active, no adult motion was detected in the kitchen, and Leila is currently in a scheduled work meeting.',
    sensorsUsed: ['Kitchen motion sensor', 'Family presence', 'Calendar', 'Stove state', 'Kids Safety Mode'],
    ruleApplied: 'Children cannot activate cooking appliances without adult presence.',
    availableActions: ['Call child', 'Keep blocked', 'View sensor context', 'Change rule', 'Allow once'],
    explanationId: 'explain-mia-stove'
  }
];

export const modes = [
  {
    id: 'focus',
    name: 'Focus / Work Mode',
    description: 'Prepares Leila’s office, reduces noise, and keeps only important alerts active.',
    active: true,
    icon: 'Briefcase',
    trigger: 'Calendar meeting starts within 15 minutes',
    devicesAffected: ['Office Thermostat', 'Office Lights', 'Washing Machine', 'Assistant Notifications'],
    rules: ['Warm office to 22°C', 'Pause noisy spin cycles', 'Safety alerts always break through'],
    autonomyLevel: 'Medium',
    notificationLevel: 'Important only',
    safetyOverrides: ['Kids Safety alerts remain active'],
    energyBehavior: 'Comfort priority during meeting, then eco recovery'
  },
  {
    id: 'dnd',
    name: 'Do Not Disturb Mode',
    description: 'Suppresses non-critical notifications while keeping safety events visible.',
    active: false,
    icon: 'BellOff',
    trigger: 'Manual or calendar-based',
    devicesAffected: ['Notifications', 'Voice Assistant'],
    rules: ['Mute low-priority updates', 'Allow safety alerts'],
    autonomyLevel: 'Low',
    notificationLevel: 'Critical only',
    safetyOverrides: ['Critical alerts always visible'],
    energyBehavior: 'No energy changes'
  },
  {
    id: 'kids-home',
    name: 'Kids Home Mode',
    description: 'Enables stricter appliance and door safety rules when children are home.',
    active: true,
    icon: 'Shield',
    trigger: 'Child presence detected',
    devicesAffected: ['Oven/Stove', 'Door Lock', 'Motion Sensors', 'Voice Assistant'],
    rules: ['Block cooking appliances for children', 'Notify parent for door events', 'Keep safety alerts active'],
    autonomyLevel: 'High for blocking, low for actions',
    notificationLevel: 'Safety focused',
    safetyOverrides: ['Cannot be muted while children are home'],
    energyBehavior: 'Normal'
  },
  {
    id: 'study',
    name: 'Study Mode',
    description: 'Creates a calmer homework environment for Adam and Mia.',
    active: false,
    icon: 'BookOpen',
    trigger: 'Weekdays after school',
    devicesAffected: ['Kids Room Lights', 'Living Room TV Plug', 'Assistant'],
    rules: ['Warm lighting', 'Reduce distractions', 'Delay noisy appliances'],
    autonomyLevel: 'Medium',
    notificationLevel: 'Normal',
    safetyOverrides: ['Kids Safety remains active'],
    energyBehavior: 'Moderate'
  },
  {
    id: 'guest',
    name: 'Guest Mode',
    description: 'Keeps private rooms and sensitive controls hidden while guests are present.',
    active: false,
    icon: 'Users',
    trigger: 'Manual or guest arrival',
    devicesAffected: ['Door Lock', 'Lights', 'Assistant Privacy'],
    rules: ['Hide private routines', 'Limit voice commands', 'Require approval for door unlock'],
    autonomyLevel: 'Low',
    notificationLevel: 'Normal',
    safetyOverrides: ['Door unlock requires approval'],
    energyBehavior: 'Comfort balanced'
  },
  {
    id: 'night',
    name: 'Night Mode',
    description: 'Secures the home, dims lights, and shifts heating to sleep comfort.',
    active: false,
    icon: 'Moon',
    trigger: '22:30 or manual',
    devicesAffected: ['Door Lock', 'Lights', 'Thermostats', 'Motion Sensors'],
    rules: ['Lock doors', 'Dim hallway lights', 'Lower heating slightly'],
    autonomyLevel: 'Medium',
    notificationLevel: 'Critical only',
    safetyOverrides: ['Smoke, door, and child alerts break through'],
    energyBehavior: 'Eco sleep'
  },
  {
    id: 'away',
    name: 'Away Mode',
    description: 'Optimizes energy and security when the apartment is empty.',
    active: false,
    icon: 'Lock',
    trigger: 'Everyone away',
    devicesAffected: ['Door Lock', 'Thermostats', 'Lights', 'Appliances'],
    rules: ['Lock door', 'Turn off unused lights', 'Eco heating', 'Check appliances'],
    autonomyLevel: 'Medium',
    notificationLevel: 'Security focused',
    safetyOverrides: ['Security alerts active'],
    energyBehavior: 'Energy saving'
  },
  {
    id: 'vacation',
    name: 'Vacation Mode',
    description: 'Longer-term energy saving and security simulation for travel.',
    active: false,
    icon: 'Plane',
    trigger: 'Manual or travel calendar',
    devicesAffected: ['Thermostats', 'Lights', 'Door Lock', 'Fridge'],
    rules: ['Eco heating', 'Simulate presence', 'Monitor doors/windows'],
    autonomyLevel: 'Medium',
    notificationLevel: 'Security focused',
    safetyOverrides: ['Security alerts active'],
    energyBehavior: 'Maximum saving'
  }
];

export const defaultDashboardWidgets = [
  { id: 'safety', label: 'Kids Safety', pinned: true, visible: true },
  { id: 'comfort', label: 'Comfort Score', pinned: true, visible: true },
  { id: 'energy', label: 'Energy Budget', pinned: true, visible: true },
  { id: 'approvals', label: 'Pending Approvals', pinned: false, visible: true },
  { id: 'appliances', label: 'Appliance Queue', pinned: false, visible: true },
  { id: 'weather', label: 'Weather Context', pinned: false, visible: true },
  { id: 'family', label: 'Family Status', pinned: false, visible: true },
  { id: 'savings', label: 'Today’s Savings', pinned: false, visible: true },
  { id: 'security', label: 'Home Security', pinned: false, visible: false },
  { id: 'suggestions', label: 'AI Suggestions', pinned: false, visible: false }
];

export const preferences = {
  comfort: {
    officeFocusTemp: 22,
    livingRoomTemp: 21,
    kidsRoomTemp: 21,
    autoHeatingRange: 2,
    lightingPreference: 'Warm focus light during work, softer evening light'
  },
  energy: {
    monthlyBudget: 180,
    autoDelayAppliances: true,
    avoidHighPriceWindow: true,
    ecoModeWhenEmpty: true
  },
  safety: {
    kidsSafetyMode: true,
    blockChildCooking: true,
    requireAdultKitchenPresence: true,
    doorUnlockRequiresApproval: true,
    safetyAlertsOverrideDnd: true
  },
  automation: {
    lowRiskAuto: true,
    mediumRiskNeedsApproval: true,
    highRiskAlwaysApproval: true,
    criticalRiskAutoBlock: true
  }
};

export const consentSettings = [
  {
    id: 'calendarAccess',
    title: 'Calendar context',
    description: 'Use meetings and routines to prepare the home.',
    enabled: true
  },
  {
    id: 'weatherAccess',
    title: 'Weather and season context',
    description: 'Use Berlin weather and winter conditions for comfort and heating decisions.',
    enabled: true
  },
  {
    id: 'energyPriceAccess',
    title: 'Energy price context',
    description: 'Delay flexible appliances when energy prices are high.',
    enabled: true
  },
  {
    id: 'applianceControl',
    title: 'Bosch appliance control',
    description: 'Allow approved actions through Home Connect compatible devices.',
    enabled: true
  },
  {
    id: 'sensorMonitoring',
    title: 'Bosch Smart Home sensors',
    description: 'Use motion, windows, door, temperature, and air quality sensors.',
    enabled: true
  },
  {
    id: 'voiceAssistant',
    title: 'Voice assistant commands',
    description: 'Allow Alexa or in-app voice commands with safety checks.',
    enabled: true
  },
  {
    id: 'longTermMemory',
    title: 'Household memory',
    description: 'Store preferences and recurring patterns for personalization.',
    enabled: true
  },
  {
    id: 'shareWithThirdParties',
    title: 'Share data with third parties',
    description: 'Keep household data private unless explicitly enabled.',
    enabled: false
  }
];

export const explanations = {
  'explain-mia-stove': {
    id: 'explain-mia-stove',
    title: 'Why the stove was blocked',
    summary:
      'Mia attempted to activate the stove. The action was blocked because the device is critical-risk, Mia is a child, no adult motion was detected in the kitchen, and Leila is in a scheduled meeting.',
    decision: 'Blocked automatically',
    riskLevel: 'Critical',
    confidence: 98,
    timeline: [
      { time: '14:07', event: 'Mia detected in kitchen by motion sensor.' },
      { time: '14:08', event: 'Stove activation attempt received.' },
      { time: '14:08', event: 'Calendar confirms Leila is in Client sync meeting.' },
      { time: '14:08', event: 'No adult motion detected in kitchen.' },
      { time: '14:08', event: 'Kids Safety Mode blocks the action and notifies Leila.' }
    ],
    signals: ['Kitchen motion sensor', 'Family presence', 'Bosch oven/stove state', 'Calendar', 'Kids Safety Mode'],
    rules: ['Children cannot activate cooking appliances without adult presence.'],
    preferences: ['Safety alerts override Do Not Disturb and Focus Mode.'],
    alternatives: ['Call child', 'Keep blocked', 'Wait for adult presence', 'Review safety rule'],
    systemIntelligence: true
  },
  'explain-dishwasher-delay': {
    id: 'explain-dishwasher-delay',
    title: 'Why dishwasher delay was recommended',
    summary:
      'The dishwasher is ready, but energy prices are lower after 21:00. Because the household is at 82% of its monthly budget, the AI recommends running Eco 50° at 21:30.',
    decision: 'Ask approval to schedule',
    riskLevel: 'Low',
    confidence: 91,
    timeline: [
      { time: '13:42', event: 'Bosch dishwasher became ready.' },
      { time: '13:45', event: 'Energy service reported high price window.' },
      { time: '13:46', event: 'Budget guard detected 82% monthly usage.' },
      { time: '13:47', event: 'AI scheduled recommended run for 21:30.' }
    ],
    signals: ['Dishwasher state', 'Energy prices', 'Monthly budget', 'Household quiet hours'],
    rules: ['Delay flexible appliances when energy prices are high.'],
    preferences: ['Run dishwasher in Eco 50° when possible.'],
    alternatives: ['Run now', 'Schedule later', 'Change program'],
    systemIntelligence: true
  },
  'explain-office-heat': {
    id: 'explain-office-heat',
    title: 'Why the office was warmed',
    summary:
      'Focus Mode detected a meeting starting soon and adjusted the office thermostat within Leila’s allowed comfort range.',
    decision: 'Auto-handled',
    riskLevel: 'Low',
    confidence: 94,
    timeline: [
      { time: '14:06', event: 'Calendar detected meeting in 12 minutes.' },
      { time: '14:06', event: 'Office measured at 20°C.' },
      { time: '14:07', event: 'Preference matched: focus temperature 22°C.' },
      { time: '14:07', event: 'Thermostat adjusted by +2°C.' }
    ],
    signals: ['Calendar', 'Office thermostat', 'Occupancy', 'Weather'],
    rules: ['Low-risk comfort changes may be automated within ±2°C.'],
    preferences: ['Office focus temperature is 22°C.'],
    alternatives: ['Do nothing', 'Ask first', 'Use blanket reminder'],
    systemIntelligence: true
  },
  'explain-window-reminder': {
    id: 'explain-window-reminder',
    title: 'Why the window reminder appeared',
    summary:
      'The kitchen window has been open for 18 minutes while heating is active and outside temperature is 4°C.',
    decision: 'Suggested reminder',
    riskLevel: 'Low',
    confidence: 88,
    timeline: [
      { time: '13:50', event: 'Kitchen window opened.' },
      { time: '14:08', event: 'Heating still active while outside temperature is 4°C.' }
    ],
    signals: ['Window sensor', 'Heating state', 'Outdoor weather', 'Energy budget'],
    rules: ['Warn when heating is active and window remains open in winter.'],
    preferences: ['Protect energy budget.'],
    alternatives: ['Turn down kitchen heating', 'Remind kids', 'Ignore for 30 minutes'],
    systemIntelligence: true
  },
  'explain-coffee-before-meeting': {
    id: 'explain-coffee-before-meeting',
    title: 'Why coffee preparation needs approval',
    summary:
      'The coffee machine is a heated appliance. The assistant noticed Leila often prepares coffee before client syncs, but it asks before starting.',
    decision: 'Needs approval',
    riskLevel: 'Medium',
    confidence: 76,
    timeline: [
      { time: '14:04', event: 'Coffee machine reported ready.' },
      { time: '14:05', event: 'Routine memory matched afternoon meeting pattern.' },
      { time: '14:06', event: 'Medium-risk heated appliance requires approval.' }
    ],
    signals: ['Coffee machine state', 'Calendar', 'Routine memory'],
    rules: ['Medium-risk appliance actions require approval.'],
    preferences: ['Suggest coffee before client meetings, do not auto-start.'],
    alternatives: ['Prepare now', 'Dismiss', 'Ask again tomorrow'],
    systemIntelligence: true
  },
  'explain-washer-pause': {
    id: 'explain-washer-pause',
    title: 'Why the washer was paused',
    summary:
      'Focus Mode delayed the washer spin cycle because it could create noise during Leila’s meeting.',
    decision: 'Auto-handled',
    riskLevel: 'Low',
    confidence: 89,
    timeline: [
      { time: '14:03', event: 'Washer approached spin cycle.' },
      { time: '14:04', event: 'Meeting detected in calendar.' },
      { time: '14:05', event: 'Focus Mode delayed spin until after meeting.' }
    ],
    signals: ['Washer cycle state', 'Calendar', 'Room adjacency', 'Focus Mode'],
    rules: ['Low-risk appliance timing may be adjusted during Focus Mode.'],
    preferences: ['Reduce background noise during calls.'],
    alternatives: ['Continue spin', 'Pause manually', 'Reschedule cycle'],
    systemIntelligence: true
  }
};

export const chatSeedMessages = [
  {
    id: 'msg-1',
    role: 'assistant',
    text:
      'Hi Leila. Focus Mode is active, Kids Safety Mode is protecting cooking appliances, and I found two actions that need your approval.'
  }
];

export const systemIntelligence = [
  {
    id: 'home-connect',
    title: 'Bosch Home Connect',
    status: '6 appliances connected',
    detail: 'Dishwasher, washing machine, dryer, oven, fridge, and coffee machine states are available.'
  },
  {
    id: 'bosch-smart-home',
    title: 'Bosch Smart Home sensors',
    status: '14 sensors active',
    detail: 'Motion, window, temperature, air quality, and door context inform decisions.'
  },
  {
    id: 'aws-agentcore',
    title: 'AWS AgentCore',
    status: 'Coordinating agents',
    detail: 'Comfort, energy, safety, and routine agents evaluate context and actions.'
  },
  {
    id: 'mongodb-atlas',
    title: 'MongoDB Atlas',
    status: 'Household memory enabled',
    detail: 'Preferences, routines, consent, and explanation history are stored for retrieval.'
  },
  {
    id: 'llm-risk',
    title: 'LLM risk & preference evaluation',
    status: 'Enabled',
    detail: 'Actions are classified by risk and checked against household rules.'
  },
  {
    id: 'external-context',
    title: 'External context',
    status: 'Weather, season, calendar, and energy prices active',
    detail: 'Berlin weather, winter state, calendar events, and price windows shape recommendations.'
  }
];
