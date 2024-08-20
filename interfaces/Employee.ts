interface DefineEmployee {
    id: number;
    firstname: string;
    lastname: string;
    birthdate: string; // Date strings from API
    employeeid: string;
    salary: number;
    role: string;
    manager: string | null;
    joiningdate: string; // Date strings from API
    leavedays: number;
    linkedin: string;
    orgid: string;
    email: string;
    password: string;
    bio: string;
    gravatarurl: string;
}

// Create a type where all fields are optional
type Employee = Partial<DefineEmployee>;

export type { Employee };
