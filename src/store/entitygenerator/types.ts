export interface TableColumnDTO{
    columnName: string
    columnType: string,
    dataType: string,
    nullable: boolean,
    foreignKey: boolean,
    characterMaxLength: number
}