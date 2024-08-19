// CREATE TABLE [dbo].[employee] (
//     [id]          INT                 IDENTITY (1, 1) NOT NULL,
//     [firstName]   NVARCHAR (50)       NULL,
//     [lastName]    NVARCHAR (50)       NULL,
//     [birthDate]   DATE                NULL,
//     [employeeId]  UNIQUEIDENTIFIER    NULL,
//     [salary]      FLOAT (53)          NULL,
//     [role]        NVARCHAR (50)       NULL,
//     [manager]     UNIQUEIDENTIFIER    NULL,
//     [joiningDate] DATE                NULL,
//     [leaveDays]   INT                 NULL,
//     [linkedIn]    VARCHAR (MAX)       NULL,
//     [orgId]       UNIQUEIDENTIFIER    NULL,
//     [email]       VARCHAR (MAX)       NULL,
//     [password]    VARCHAR (MAX)       NULL,
//     [hierarchyId] [sys].[hierarchyid] NULL,
//     [bio]         TEXT                NULL,
//     [gravatarURL] NVARCHAR (MAX)      NULL,
//     CONSTRAINT [PK_emp] PRIMARY KEY CLUSTERED ([id] ASC),
//     CONSTRAINT [FK_org] FOREIGN KEY ([orgId]) REFERENCES [dbo].[organisation] ([id]) ON DELETE CASCADE ON UPDATE CASCADE,
//     INDEX [GRAPH_UNIQUE_INDEX_60C23A527BEC49ABB7E8AFC627A748CB] UNIQUE NONCLUSTERED ($node_id)
// ) AS NODE;

interface DefineEmployee {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string; // Date strings from API
    employeeId: string;
    salary: number;
    role: string;
    manager: string | null;
    joiningDate: string; // Date strings from API
    leaveDays: number;
    linkedIn: string;
    orgId: string;
    email: string;
    password: string;
    bio: string;
    gravatarURL: string;
}

// Create a type where all fields are optional
type Employee = Partial<DefineEmployee>;

export type { Employee };
