// Centralized in-memory state engine for modular design sandbox pages.
import initialHands from './data/hands.json';
import initialVillains from './data/villains.json';

// Define the baseline state
export const state = {
  // Theme settings
  gridColor: '0, 240, 255',

  // Active Session Filter ('all', 'session-37', 'session-36', 'session-35')
  activeSession: 'all',

  // Databases
  hands: [...initialHands],
  villains: [...initialVillains],

  // Pre-aggregated Lifetime Stats
  lifetime: {
    hands: 10716,
    tournaments: 250,
    abi: 1.10,
    netProfit: 388.85,
    totalInvested: 275.00,
    totalPrizes: 663.85,
    roi: 141.4,
    itm: 35.6,
    itmCashes: 89,
    compliance: 87.5,
    vpip: 21.8,
    pfr: 17.2,
    threeBet: 8.4,
    cbet: 68.2,
    cbetHu: 98.4,
    af: 3.1,
    wtsd: 28,
    wonSd: 51,
    steal: 34,
    chips: 324580,
    bb100: 8.24,
    bestResult: 112.50,
    worstResult: -32.40,
    // "30-second answer" verdict (modelled on the real ValueSnapshotCard)
    verdict: {
      reco: 'Subir de stake',
      recoClass: 'up',          // up | hold | down | sample
      readiness: 78,            // 0-100
      confidence: 'Alta',
      roiLabel: '+141.4% ROI',
      profitLabel: '+$388.85 acumulado',
      blockerTitle: 'Abertura de BTN ampla demais',
      blockerDetail: 'O fundo do range de botão custa -28bb/100 contra blinds ativos.',
      action: 'Fold K7s, Q5s e T7s no botão',
      actionTab: 'leaks'
    },
    // "Headline Incident" — the #1 leak told as editorial prose + the offending hands
    headline: {
      kick: 'Incidente de destaque · O leak nº1',
      title: 'O botão abriu amplo demais',
      pos: 'BTN',
      scenario: 'rfi',
      prose: 'Seu open de botão está em <em>58%</em> contra o alvo GTO de 48–52%. Os 8% inferiores de aberturas — mãos como <em>K7s, Q5s e T7s</em> — sangram em média <em>-28bb/100</em> contra blinds que reagem. Corte essas mãos e o gráfico vira de vez.',
      costBb: '-28bb/100',
      offending: ['K7s', 'Q5s', 'T7s', 'Q4s', 'J6s', 'T6s', 'K3o', 'Q7o'],
      metaLeft: '58% open vs 48–52% alvo',
      metaRight: '1.842 mãos · BTN',
      actionTab: 'ranges'
    },
    nemeses: [
      { name: 'villain_crusher', amountBb: -32.0, type: 'Nemesis' },
      { name: 'shark_reg', amountBb: -18.4, type: 'Nemesis' },
      { name: 'fish_king_22', amountBb: 42.3, type: 'Victim' },
      { name: 'whale_caller', amountBb: 28.1, type: 'Victim' }
    ],
    stackBands: [
      { label: '<10bb (push)', value: -4230, width: 14, class: 'loss' },
      { label: '10-17bb (crit)', value: -8120, width: 22, class: 'loss' },
      { label: '17-25bb (warn)', value: 24100, width: 65, class: '' },
      { label: '25-40bb (mid)', value: 18400, width: 48, class: '' },
      { label: '40bb+ (deep)', value: 112450, width: 88, class: '' }
    ],
    alerts: [
      {
        id: 'alert-btn-rfi',
        title: 'BTN RFI over-widening (+8.0% deviation)',
        severity: 'loss',
        body: 'Your button open is currently 58% vs. the target 48-52% GTO benchmark. The bottom 8% of opens are losing an average of -28bb/100 against active blinds. Actionable fix: Fold K7s, Q5s, and T7s preflop. Practice in Ranges lab to commit standard BTN boundaries to memory.'
      },
      {
        id: 'alert-bb-fold',
        title: 'BB overfolding vs BTN open steal (-12.0% deviation)',
        severity: 'warn',
        body: 'You are folding the Big Blind 68% vs. late openings, giving button steals free chips. Optimal ranges require a defend rate of at least 52%. Actionable fix: Defend hands like T8o, 97o, and Q6s by flatting raises. Fold less to min-raises.'
      }
    ]
  },

  // Sessions Database
  sessions: [
    {
      id: 'session-37',
      num: 37,
      date: '30/05/2026',
      time: '18:42 - 21:12',
      hands: 420,
      tournaments: 3,
      buyIns: 3.30,
      prizes: 12.40,
      pnl: 9.10,
      bb100: 12.4,
      compliance: 88.5,
      vpip: 23.1,
      pfr: 19.4,
      threeBet: 7.5,
      af: 2.6,
      cbet: 65.0,
      cbetHu: 95.0,
      wtsd: 24.0,
      chips: 14200,
      nemesis: 'villain_crusher',
      nemesisLoss: -32.0,
      insight: 'Elite discipline. You maintained GTO open compliance at 88.5%. Turn actions were stable, but check blind defenses against late opens.',
      alerts: [
        {
          id: 'alert-sb-def',
          title: 'SB folding too much vs BTN min-opens (-8.0%)',
          severity: 'warn',
          body: 'You folded 74% from Small Blind to late raises this session. Actionable fix: Defend wider with suited gappers and small pocket pairs.'
        }
      ],
      stackBands: [
        { label: '<10bb (push)', value: 1200, width: 25, class: '' },
        { label: '10-17bb (crit)', value: -2100, width: 15, class: 'loss' },
        { label: '17-25bb (warn)', value: 4500, width: 40, class: '' },
        { label: '25-40bb (mid)', value: 8800, width: 68, class: '' },
        { label: '40bb+ (deep)', value: 1800, width: 30, class: '' }
      ],
      nemeses: [
        { name: 'villain_crusher', amountBb: -32.0, type: 'Nemesis' },
        { name: 'fish_king_22', amountBb: 42.3, type: 'Victim' }
      ]
    },
    {
      id: 'session-36',
      num: 36,
      date: '28/05/2026',
      time: '19:15 - 23:45',
      hands: 1120,
      tournaments: 6,
      buyIns: 6.60,
      prizes: 0.00,
      pnl: -6.60,
      bb100: -4.8,
      compliance: 81.2,
      vpip: 26.8,
      pfr: 16.2,
      threeBet: 6.4,
      af: 1.8,
      cbet: 58.0,
      cbetHu: 82.0,
      wtsd: 32.0,
      chips: -24800,
      nemesis: 'fish_king_22',
      nemesisLoss: -78.0,
      insight: 'Low compliance. Blinds defense was too wide vs HJ/CO openers. Re-evaluate SB fold criteria.',
      alerts: [
        {
          id: 'alert-btn-rfi',
          title: 'BTN RFI over-widening (+10.0% deviation)',
          severity: 'loss',
          body: 'Your button open was 60% this session, leading to expensive folds against aggressive SB/BB 3-bets. Actionable fix: Fold K8o, Q7o, J7s.'
        }
      ],
      stackBands: [
        { label: '<10bb (push)', value: -4500, width: 35, class: 'loss' },
        { label: '10-17bb (crit)', value: -8400, width: 52, class: 'loss' },
        { label: '17-25bb (warn)', value: 1200, width: 12, class: '' },
        { label: '25-40bb (mid)', value: 6900, width: 44, class: '' },
        { label: '40bb+ (deep)', value: -18000, width: 75, class: 'loss' }
      ],
      nemeses: [
        { name: 'fish_king_22', amountBb: -78.0, type: 'Nemesis' },
        { name: 'whale_caller', amountBb: 28.1, type: 'Victim' }
      ]
    },
    {
      id: 'session-35',
      num: 35,
      date: '25/05/2026',
      time: '17:00 - 22:30',
      hands: 840,
      tournaments: 4,
      buyIns: 4.40,
      prizes: 24.20,
      pnl: 19.80,
      bb100: 22.1,
      compliance: 91.4,
      vpip: 21.2,
      pfr: 18.5,
      threeBet: 9.1,
      af: 3.2,
      cbet: 72.0,
      cbetHu: 98.0,
      wtsd: 22.0,
      chips: 38400,
      nemesis: 'shark_reg',
      nemesisLoss: -18.4,
      insight: 'Outstanding session. Preflop ranges were followed perfectly. Value betting sizes were sized optimally.',
      alerts: [],
      stackBands: [
        { label: '<10bb (push)', value: 500, width: 10, class: '' },
        { label: '10-17bb (crit)', value: 4200, width: 32, class: '' },
        { label: '17-25bb (warn)', value: 12400, width: 78, class: '' },
        { label: '25-40bb (mid)', value: 5000, width: 28, class: '' },
        { label: '40bb+ (deep)', value: 16300, width: 55, class: '' }
      ],
      nemeses: [
        { name: 'shark_reg', amountBb: -18.4, type: 'Nemesis' },
        { name: 'whale_caller', amountBb: 98.0, type: 'Victim' }
      ]
    }
  ],

  // Preflop GTO Drill Trainer State
  drill: {
    total: 0,
    correct: 0,
    streak: 0,
    history: []
  },

  // Range Builder Custom Matrix State (Position -> Scenario -> Combos map)
  customRanges: {
    // Initial loaded ranges
    BTN: {
      rfi: {
        Always: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', 'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo', 'KTo'],
        Mix: ['66', '55', 'K7s', 'K6s', 'Q8s', 'J8s', 'T8s', '98s', '87s', '76s', 'A9o', 'A8o', 'KQo', 'QJo', 'JTo']
      }
    }
  },

  // Listeners list for reactive UI updates
  listeners: [],

  // Subscribe to state updates
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  },

  // Broadcast state changes
  notify() {
    this.listeners.forEach(callback => callback(this));
  }
};
