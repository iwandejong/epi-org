// CREATE TABLE [dbo].[organisation] (
//     [id]        UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
//     [name]      NVARCHAR (50)    NULL,
//     [createdAt] DATETIME2 (7)    DEFAULT (sysdatetime()) NOT NULL,
//     CONSTRAINT [PK_org] PRIMARY KEY CLUSTERED ([id] ASC)
// );

interface Organisation {
    id: string;
    name: string;
    createdAt: Date;
}

export type { Organisation };