interface Tree {
    id: number;
    firstName: string;
    lastName: string;
    employeeId: string;
    role: string;
    manager: string | null;
    gravatarURL: string;

    children?: Tree[] | null;
}

export type { Tree };
