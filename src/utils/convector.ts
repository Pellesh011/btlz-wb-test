import { IWbApiСommission, IDbСommission } from "#core/types/commission.js"

export const convertWbCommisionToDbCommision = (wbCommissions: IWbApiСommission[]): IDbСommission[] => {
    return wbCommissions.map(wbCommission => ({
        kgvp_marketplace: wbCommission.kgvpMarketplace,
        kgvp_supplier: wbCommission.kgvpSupplier,
        kgvp_supplier_express: wbCommission.kgvpSupplierExpress,
        paid_storage_kgvp: wbCommission.paidStorageKgvp,
        parent_id: wbCommission.parentID,
        parent_name: wbCommission.parentName,
        subject_id: wbCommission.subjectID,
        subject_name: wbCommission.subjectName,
        timestamp: wbCommission.timeStamp,
    }));
}