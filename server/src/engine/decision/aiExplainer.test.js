import { expect } from 'chai';
import { explainDecision } from './aiExplainer.js';

describe('AI Explainer Engine', () => {
  it('should explain a High Risk Reroute scenario', () => {
    const input = {
      risk: {
        score: 85,
        level: "High",
        breakdown: { traffic: 45, delay: 30, weather: 10 }
      },
      decision: { action: "REROUTE" },
      cost: { savings: 1500, noActionCost: 5000, rerouteCost: 3500 }
    };

    const result = explainDecision(input);
    expect(result).to.have.property('explanation');
    expect(result.explanation).to.include('High traffic congestion');
    expect(result.explanation).to.include('saving approximately INR 1500.00');
    expect(result.keyFactors).to.include('traffic');
    expect(result.summary).to.include('Rerouting recommended');
  });

  it('should explain a Moderate Monitor scenario', () => {
    const input = {
      risk: {
        score: 55,
        level: "Medium",
        breakdown: { weather: 35, delay: 20, traffic: 0 }
      },
      decision: { action: "MONITOR" },
      cost: { savings: 0, noActionCost: 1000, rerouteCost: 1500 }
    };

    const result = explainDecision(input);
    expect(result.keyFactors).to.include('weather');
    expect(result.explanation).to.include('Challenging weather');
    expect(result.summary).to.include('Monitoring advised');
  });

  it('should explain a Low Risk scenario', () => {
    const input = {
      risk: {
        score: 20,
        level: "Low",
        breakdown: { traffic: 10, weather: 5, delay: 5 }
      },
      decision: { action: "CONTINUE" },
      cost: { savings: 0, noActionCost: 200, rerouteCost: 1200 }
    };

    const result = explainDecision(input);
    expect(result.explanation).to.include('Conditions are stable');
    expect(result.summary).to.equal('Safe to continue current route');
  });
});
