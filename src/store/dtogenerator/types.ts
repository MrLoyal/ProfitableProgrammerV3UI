export interface DTOGeneratorProps{

}

export interface EntityBasicProp {
    name: string,
    javaType: string
}

export interface EntityManyToOneProperty {
    name: string,
    javaType: string
}

export interface EntityPropertiesResponseData{
    basicPropsList?: Array<EntityBasicProp>,
    m2oPropsList?: Array<EntityManyToOneProperty>
}
export interface EntityPropertiesResponse {
    data?: EntityPropertiesResponseData
}