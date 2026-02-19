export interface AddReceiptRequestBody {
    date: string;
    typeExpenses: string;
    companyName: string;
    address: string;
    tinNumber: string;
    image: File;
    gross: number;
}

export interface EditReceiptRequestBody {
    date: string;
    typeExpenses: string;
    companyName: string;
    address: string;
    tinNumber: string;
    gross: number;
}
