/**
 * Decodes the property's value into the given type.
 * 
 * @param property The property to decode.
 * @param keyword  The keyword to find as a starting point.
 * @param transformation The transformer to use to decode the value.
 * @returns The decoded value.
 */
function decode(property: string[], keyword: string, transformation: (value: string) => any): any {
    const value = property[1]

    return transformation(value.substring((keyword + "(").length, value.length - 1));
}

/**
 * Checks whether we can decode the given property into the given keyword.
 * 
 * @param property The property to check.
 * @param keyword The keyword to check whether the value can decode.
 * @returns Can we decode this property?
 */
function canDecode(property: string[], keyword: string) {
    const value = property[1]
    return value.startsWith(`${keyword}(`) && value.endsWith(`)`);
}

interface Decoder {
    keyword: string,
    transformer: (value: string) => any
}

const decoders: Decoder[] = [
    {
        keyword: "Number",
        transformer: (value: string) => Number.parseInt(value)
    },
    {
        keyword: "Date",
        transformer: (value: string) => new Date(value)
    },
    {
        keyword: "Long",
        transformer: (value: string) => Number.parseInt(value)
    },
    {
        keyword: "Int",
        transformer: (value: string) => Number.parseInt(value)
    }
]

export default (query) => {
    const value = query.value;
    let json = {};

    if (value.includes('=')) {
        value.split('\n').forEach(element => {
            if (element.includes('=')) {
                const property = element.split('=', 2);
                json[property[0]] = property[1];

                for (const decoder of decoders) {
                    if (canDecode(property, decoder.keyword)) {
                        json[property[0]] = decode(property, decoder.keyword, decoder.transformer);
                    }
                }
                console.log(json[property[0]]);
            }
        });
    } else {
        json = JSON.parse(value);
    }

    return json;
}