import { getHistory, getHistoryByShipment } from "../engine/history/historyEngine.js";

export const getAllHistory = (req, res) => {
  const history = getHistory();
  return res.status(200).json({
    success: true,
    history
  });
};

export const getShipmentHistory = (req, res) => {
  const { shipmentId } = req.params;
  const history = getHistoryByShipment(shipmentId);

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
