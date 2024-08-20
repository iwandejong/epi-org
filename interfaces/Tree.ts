interface Tree {
    id: number;
    firstname: string;
    lastname: string;
    employeeid: string;
    role: string;
    manager: string | null;
    gravatarURL: string;

    children?: Tree[] | null;
}

export type { Tree };
