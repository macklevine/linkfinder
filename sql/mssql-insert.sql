BULK INSERT DATABASE.user.table
    FROM '~\Downloads\backlinks.csv'
    WITH
    (
    FIRSTROW = 1,
    FIELDTERMINATOR = ',',  --delimiter
    ROWTERMINATOR = '\n',   --line break
    ERRORFILE = '~\Downloads\errors.csv',
    MAXERRORS = 1000,
    TABLOCK
    )