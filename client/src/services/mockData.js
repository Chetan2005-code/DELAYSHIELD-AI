export const MOCK_SHIPMENTS = [
  {
    id: 'SHP-10042',
    origin: { name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
    destination: { name: 'Boston, MA', lat: 42.3601, lng: -71.0589 },
    status: 'In Transit',
    currentLocation: { lat: 41.5, lng: -72.5 },
    etas: { original: '14:30 EST', updated: '16:45 EST' },
    riskFactors: {
      traffic: 65,
      weather: 20,
      delay: 15
    },
    riskScore: 'High',
    currentCost: 1200,
    potentialLoss: 450,
  },
  {
    id: 'SHP-88391',
    origin: { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
    destination: { name: 'Detroit, MI', lat: 42.3314, lng: -83.0458 },
    status: 'In Transit',
    currentLocation: { lat: 41.9, lng: -85.5 },
    etas: { original: '10:00 CST', updated: '10:15 CST' },
    riskFactors: {
      traffic: 10,
      weather: 80,
      delay: 10
    },
    riskScore: 'Medium',
    currentCost: 800,
    potentialLoss: 120,
  }
];

export const MOCK_AI_INSIGHTS = {
  'SHP-10042': {
    summary: "A 20% increase in traffic will push the system into a high-risk zone, requiring proactive rerouting.",
    dominantFactor: "Traffic contributes 65% of total risk, making it the primary cause of delay.",
    actions: [
      {
        type: 'Reroute',
        description: 'Reroute via I-90 W (Faster Route)',
        tradeOff: 'Reduces delay by 45 mins but increases fuel cost by 15%.',
        costImpact: '+ $180',
        recommended: true
      },
      {
        type: 'Delay',
        description: 'Delay shipment until peak traffic clears.',
        tradeOff: 'Saves fuel cost, but risks SLA violation for high-priority delivery.',
        costImpact: '- $0',
        recommended: false
      }
    ]
  }
};
