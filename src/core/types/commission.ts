export interface IDbСommission {
  kgvp_marketplace: number;
  kgvp_supplier: number;
  kgvp_supplier_express: number;
  paid_storage_kgvp: number;
  parent_id: number;
  parent_name: string;
  subject_id: number;
  subject_name: string;
  timestamp: number;
}

export interface IWbApiСommission {
  kgvpMarketplace: number;
  kgvpSupplier: number;
  kgvpSupplierExpress: number;
  paidStorageKgvp: number;
  parentID: number;
  parentName: string;
  subjectID: number;
  subjectName: string;
  timeStamp: number;
}

export interface ICommissionsRepository {
  getAll(): Promise<IDbСommission[]>;
  getByTimestamp(timestamp: number): Promise<IDbСommission[]>;
  create(report: IDbСommission): Promise<void>;
  createOrUpdate(report: IDbСommission): Promise<void>;
  butchCreateOrUpdate(reports: IDbСommission[], batchSize: number): Promise<void>;
  getById(id: number): Promise<IDbСommission | undefined>;
  update(id: number, report: Partial<IDbСommission>): Promise<void>;
  delete(id: number): Promise<void>;
}

