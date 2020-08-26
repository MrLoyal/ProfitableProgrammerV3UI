export function snakeToCammelVar(snake: string) {
    let camel = "";
    for (var i = 0; i < snake.length; i++) {
        let currentChar = snake.charAt(i);
        if (currentChar === '_' && i < snake.length - 1) {
            camel = camel + snake.charAt(i + 1).toUpperCase();
            i++;
        } else {
            camel = camel + snake.charAt(i);
        }
    }
    return camel;
}

export function pluralize(noun: string): string {
    return noun + 's';
}

export function classNameToVarName(className: string) {
    let first = className.charAt(0);
    return first.toLowerCase() + className.substring(1);
}


export function dbColumnNameToVarName(colName: string): string {
    let varName = snakeToCammelVar(colName);
    if (varName.endsWith("Id")) {
        varName = varName.substr(0, varName.length - 2)
    }
    return varName;
}

export function capitalise(str: string): string {
    let first: string = str.charAt(0);
    first = first.toUpperCase();
    str = str.substring(1);
    return first + str;
}

export function snakeToCammelClass(snake: string) {
    let clazz = snakeToCammelVar(snake);
    return capitalise(clazz);
}

export function dbTypeToJavaType(dbType: string, nullable: boolean): string {
    switch (dbType) {
        case 'bit':
            return nullable ? 'Boolean' : 'boolean';
        case 'tinyint':
        case 'smallint':
        case 'mediumint':
        case 'int':
            return nullable ? 'Integer' : 'int';
        case 'bigint':
            return nullable ? 'Long' : 'long';
        case 'float':
            return nullable ? 'Float' : 'float';
        case 'double':
            return nullable ? 'Double' : 'double';
        case 'timestamp':
        case 'datetime':
            return 'java.time.LocalDateTime';
        case 'date':
            return 'java.time.LocalDate';
        case 'char':
        case 'varchar':
        case 'text':
        case 'longtext':
            return 'String';
        default:
            return ''
    }
}

export function toWrapperType(mayBePrimitiveType: string): string {
    switch (mayBePrimitiveType) {
        case 'int':
            return 'Integer';
        case 'long':
        case 'double':
        case 'float':
        case 'boolean':
            return capitalise(mayBePrimitiveType);
        default:
            return mayBePrimitiveType;
    }
}