CREATE TABLE [dbo].[employee] (
    [id]          INT                 IDENTITY (1, 1) NOT NULL,
    [firstname]   NVARCHAR (50)       NULL,
    [lastname]    NVARCHAR (50)       NULL,
    [birthdate]   DATE                NULL,
    [employeeid]  UNIQUEIDENTIFIER    NULL,
    [salary]      FLOAT (53)          NULL,
    [role]        NVARCHAR (50)       NULL,
    [manager]     UNIQUEIDENTIFIER    NULL,
    [joiningdate] DATE                NULL,
    [leavedays]   INT                 NULL,
    [linkedin]    VARCHAR (MAX)       NULL,
    [orgid]       UNIQUEIDENTIFIER    NULL,
    [email]       VARCHAR (MAX)       NULL,
    [password]    VARCHAR (MAX)       NULL,
    [bio]         TEXT                NULL,
    CONSTRAINT [PK_organisation] PRIMARY KEY CLUSTERED ([id] ASC),
    INDEX [GRAPH_UNIQUE_INDEX_60C23A527BEC49ABB7E8AFC627A748CB] UNIQUE NONCLUSTERED ($node_id)
) AS NODE;

