export class EditUserRequestBody {
    id: number;
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;

    constructor(id: number, name: string, lastName: string, email: string, phoneNumber: string | null) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }
}