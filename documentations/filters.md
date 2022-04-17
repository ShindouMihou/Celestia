# Filters
Celestia supports a small variety of filter expressions that can be used to filter through the results easily which allows you to find the result that you want 
in a snap of a finger. 

To first understand the expressions allowed in Celestia, we have to lookthrough how the filter expressions are defined. In general, there are only four rules into the filter expressions and those are:
1. Properties, otherwise called as expressions, are defined in a similar manner to an `.env` file. Although JSON is accepted if needed.
2. The values of the expressions will always be of `string` unless defined by wrapping them in a **type identifier**.
3. Properties cannot start with `:` which is reserved for special operations such as `:from=ObjectId` and `:oldest=true`.
4. Type identifiers cannot be stacked with special operations or comparison operators. Use JSON for such operations.

> Filter expressions are translated into JSON before being submitted which means one can freely write JSON into the textarea and Celestia will deem it acceptable. 

## Type Identifiers
As all values are inherently string by default (assuming that we are not using JSON), Celestia needs to have some way to identify which belongs to what type and 
thereof introduces Type Identifiers which are basic identifiers that wrap around a value. A type identifier always starts with a capital letter and wraps the 
value, for instance, a boolean is written as `someBoolean=Boolean(true)`.

There isn't much type identifiers available into Celestia but here are the available ones at this moment:
- `Number`: which defines the standard Javascript Number object.
- `Long`: translates into the Number object, alternate name for the Number type identifier.
- `Int`: translates into the Number object, alternate name for the Number type identifier.
- `Boolean`: translates into a boolean.
- `Date`: translates into a standard Javascript Date object.
- `BigInt`: translates into a standard Javascript Big Integer object.

## Special Operations
Sometimes you also want to fetch results that are the oldest or starts after a specific document, this is where the special operations expressions comes into play which starts with the `:` character.
- `:oldest=Boolean()`: tells Celestia to sort the results by the oldest.
- `:from=ObjectId`: tells Celestia to start the results after the given id.

## MongoDB Selectors
You can use MongoDB selectors such as `$gt` and similar in the regular Celestia expression but we do not recommend using it for complex operations such as when 
you want to perform `$gt: 0` since Celestia doesn't support nesting of type identifiers. You can, however, use JSON to perform those complex operations for example:
```json
{
    "status": {
        "$gte": 2
    }
}
```

You can also perform the similar via Celestia which assumes that all `gte`, `lte`, `lt` and `gt` selectors are numerical operations:
```env
status=Gte(2)
```

All MongoDB comparison selectors are supported but we always recommend the usage of JSON for complex queries.