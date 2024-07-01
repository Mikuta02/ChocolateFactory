const PurchaseStatusEnum = {
    PROCESSING: "Obrada",
    APPROVED: "Odobreno",
    REJECTED: "Odbijeno",
    CANCELED: "Otkazano"
};

Object.freeze(PurchaseStatusEnum);

module.exports = PurchaseStatusEnum;
