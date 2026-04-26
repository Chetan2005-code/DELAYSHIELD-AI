import { addHistory, getHistory, getHistoryByShipment } from "../engine/history/historyEngine.js";

export const getAllHistory = (req, res) => {
  const history = getHistory(req.user.id);
  return res.status(200).json({
    success: true,
    history
  });
};

export const getShipmentHistory = (req, res) => {
  const { shipmentId } = req.params;
  const history = getHistoryByShipment(shipmentId, req.user.id);

  if (!history || history.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No history found for shipment ID: ${shipmentId}`
    });
  }

  return res.status(200).json({
    success: true,
    history
  });
};
export const createHistoryEntry = (req, res) => {
  const { shipmentId, route, decision, riskScore, costImpact } = req.body;
  
  if (!shipmentId || !decision) {
    return res.status(400).json({
      success: false,
      message: "Shipment ID and Decision are required"
    });
  }

  const record = addHistory({ shipmentId, route, decision, riskScore, costImpact, userId: req.user.id });
  
  return res.status(201).json({
    success: true,
    data: record
  });
};
