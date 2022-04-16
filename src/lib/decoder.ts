export default (query) => {
    const value = query.value;
    let json = {};

    if (value.includes('=')) {
        value.split('\n').forEach(element => {
            if (element.includes('=')) {
                const property = element.split('=', 2);
    
                let propertyValue = property[1];
    
                if (propertyValue.startsWith('N(') && propertyValue.endsWith(')')) {
                    propertyValue = Number.parseInt(propertyValue.replace('N(', '').replace(')', ''));
                }
    
                json[property[0]] = propertyValue;
            }
        });
    } else {
        json = JSON.parse(value);
    }

    return json;
}