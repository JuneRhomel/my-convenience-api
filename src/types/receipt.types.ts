export interface AddReceiptRequestBody {
    date: string;
    typeExpenses: string;
    companyName: string;
    address: string;
    tinNumber: string;
    image: File;
    gross: number;
}
