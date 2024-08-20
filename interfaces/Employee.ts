// CREATE TABLE [dbo].[employee] (
//     [id]          INT                 IDENTITY (1, 1) NOT NULL,
//     [firstname]   NVARCHAR (50)       NULL,
//     [lastname]    NVARCHAR (50)       NULL,
//     [birthdate]   DATE                NULL,
//     [employeeid]  UNIQUEIDENTIFIER    NULL,
//     [salary]      FLOAT (53)          NULL,
//     [role]        NVARCHAR (50)       NULL,
//     [manager]     UNIQUEIDENTIFIER    NULL,
//     [joiningdate] DATE                NULL,
//     [leavedays]   INT                 NULL,
//     [linkedin]    VARCHAR (MAX)       NULL,
//     [orgid]       UNIQUEIDENTIFIER    NULL,
//     [email]       VARCHAR (MAX)       NULL,
//     [password]    VARCHAR (MAX)       NULL,
//     [hierarchyId] [sys].[hierarchyid] NULL,
//     [bio]         TEXT                NULL,
//     [gravatarURL] NVARCHAR (MAX)      NULL,
//     CONSTRAINT [PK_emp] PRIMARY KEY CLUSTERED ([id] ASC),
//     CONSTRAINT [FK_org] FOREIGN KEY ([orgid]) REFERENCES [dbo].[organisation] ([id]) ON DELETE CASCADE ON UPDATE CASCADE,
//     INDEX [GRAPH_UNIQUE_INDEX_60C23A527BEC49ABB7E8AFC627A748CB] UNIQUE NONCLUSTERED ($node_id)
// ) AS NODE;

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
    gravatarURL: string;
}

// Create a type where all fields are optional
type Employee = Partial<DefineEmployee>;

export type { Employee };
