export interface RentContractModel {
  id: number;
  representativeId: string;
  contractGroupId: string;
  userId: number;
  rentFrom: string;
  rentTo: string;
  carGeneralInfoAtRentPriceForNormalDay: string;
  carGeneralInfoAtRentPriceForWeekendDay: string;
  carGeneralInfoAtRentPriceForHoliday: string;
  carGeneralInfoAtRentPricePerKmExceed: string;
  carGeneralInfoAtRentPricePerHourExceed: string;
  carDescriptionInfoAtRentCarBrand: string;
  carDescriptionInfoAtRentSeatNumber: number;
  carDescriptionInfoAtRentYearCreate: string;
  carDescriptionInfoAtRentCarColor: string;
  carDescriptionInfoAtRentCarNumber: number;
  carDescriptionInfoAtRentCarDescription: string;
  carDescriptionInfoAtRentCarFuelUse: string;
  carDescriptionInfoAtRentCarName: string;
  carDescriptionInfoAtRentCarStyle: string;
  carDescriptionInfoAtRentCarTransmission: string;
  carDescriptionInfoAtRentCarVersion: string;
  carGeneralInfoAtRentLimitedKmForMonth: string;
  carGeneralInfoAtRentPriceForMonth: string;
  createdDate: string;
  createBy: string;
  updatedDate: string;
  updateBy: string;
  isDeleted: string;
  customerSignature: string;
  staffSignature: string;
  filePath: string;
  fileWithSignsPath: string;
  isExported: string;
  approvedBy: string;
  status: string;
  paymentAmount: string;
  depositItemAsset: string;
  depositItemDescription: string;
  depositItemDownPayment: number;
  depositInfoCarRental: number,
  deliveryFee: number,
  ContractStatusId: number,
  cancelReason: string | null,
}
