export interface ManyToOneCreatorProps{

}

export interface UnMappedColumnDTO {
    columnName: string,
    dataType: string,
    columnType: string,
    foreignKey: boolean,
    referencedTable: string,
    referencedColumn: string,
    suggestedOtherSide: string
}