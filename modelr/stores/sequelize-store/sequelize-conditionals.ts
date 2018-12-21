import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const operatorsAliases = {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $not: Op.not,
    $in: Op.in,
    $notIn: Op.notIn,
    $is: Op.is,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $regexp: Op.regexp,
    $notRegexp: Op.notRegexp,
    $iRegexp: Op.iRegexp,
    $notIRegexp: Op.notIRegexp,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $overlap: Op.overlap,
    $contains: Op.contains,
    $contained: Op.contained,
    $adjacent: Op.adjacent,
    $strictLeft: Op.strictLeft,
    $strictRight: Op.strictRight,
    $noExtendRight: Op.noExtendRight,
    $noExtendLeft: Op.noExtendLeft,
    $and: Op.and,
    $or: Op.or,
    $any: Op.any,
    $all: Op.all,
    $values: Op.values,
    $col: Op.col
};


export function mapOperators(object) {
    if (Array.isArray(object)) {
        return object.map((e) => mapOperators(e));
    } else if (object === null) {
        return null;
    } else if (typeof object === 'object') {
        let mappedObject = {};
        const keys = [...Object.keys(object), ...Object.getOwnPropertySymbols(object)];
        for (const key of keys) {
            let mappedKey = operatorsAliases[key] || key;
            mappedObject[mappedKey] = mapOperators(object[key]);
        }
        return mappedObject;
    } else {
        return object;
    }
}

export function validateWhere(where) {
    if (where) {
        return mapOperators(JSON.parse(where));
    } else {
        return {};
    }
}


export function asArray(arr) {
    if (Array.isArray(arr)) {
        return arr;
    } else if (typeof arr === "string") {
        return arr.split(",");
    }
    return null;
}