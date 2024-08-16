CREATE TABLE [dbo].[employee] (
    [id]          UNIQUEIDENTIFIER    NOT NULL,
    [firstName]   NVARCHAR (50)       NULL,
    [lastName]    NVARCHAR (50)       NULL,
    [birthDate]   DATE                NULL,
    [employeeId]  UNIQUEIDENTIFIER    NULL,
    [salary]      FLOAT (53)          NULL,
    [role]        NVARCHAR (50)       NULL,
    [manager]     UNIQUEIDENTIFIER    NULL,
    [joiningDate] DATE                NULL,
    [leaveDays]   INT                 NULL,
    [linkedIn]    VARCHAR (MAX)       NULL,
    [orgId]       UNIQUEIDENTIFIER    NULL,
    [email]       VARCHAR (MAX)       NULL,
    [password]    VARCHAR (MAX)       NULL,
    [hierarchyId] [sys].[hierarchyid] NULL,
    CONSTRAINT [PK_organisation] PRIMARY KEY CLUSTERED ([id] ASC),
    INDEX [GRAPH_UNIQUE_INDEX_60C23A527BEC49ABB7E8AFC627A748CB] UNIQUE NONCLUSTERED ($node_id)
) AS NODE;

