function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export function extendSequelize(sequelize) {


    sequelize.Model.hasPrimaryKeyAttrs = function (obj) {
        let pks = this.primaryKeyAttributes;
        return pks.some((pk) => obj.hasOwnProperty(pk) && obj[pk]);
    };


    sequelize.Model.hasOnlyPkAttrs = function (obj) {
        let pks = this.primaryKeyAttributes;
        return !Object.keys(obj).some(k => pks.indexOf(k) < 0);
    };
    //
    // sequelize.Model.filterOnlyPksObjects = function (objects) {
    //     const onlyPks = [];
    //     const wValueObjects = [];
    //     for (const object of objects) {
    //         if (this.hasOnlyPrimaryKeys(object)) {
    //             onlyPks.push(object)
    //         } else {
    //             wValueObjects.push(object);
    //         }
    //     }
    //     return [onlyPks, wValueObjects];
    // };

    sequelize.Model.filterPrimaryKeys = function (object) {
        let primaryKeys = this.primaryKeyAttributes;
        let conditions = {};
        for (let key of primaryKeys) {
            if (object.hasOwnProperty(key)) {
                conditions[key] = object[key];
            }
        }
        return conditions;
    };


    sequelize.Model.filterAttributes = function (object) {
        let attributes = this.rawAttributes as { [key: string]: any }[];
        let filteredObject = {};
        for (let [key, attr] of Object.entries(attributes)) {
            if (object.hasOwnProperty(attr.fieldName)) {
                filteredObject[attr.fieldName] = object[attr.fieldName];
            }
        }
        return filteredObject;
    };

    sequelize.Model.filterAssociations = function (object) {
        let associations = this.associations;
        let filteredObject = [];
        for (let [key, association] of Object.entries(associations)) {
            if (object.hasOwnProperty(key) && object[key]) {
                filteredObject.push({
                    association: association,
                    objects: object[key]
                });
            }
        }
        return filteredObject;
    };

    sequelize.Model.bulkUpsert = async function (objects) {
        let multiple = Array.isArray(objects);
        objects = multiple ? objects : new Array(objects);

        let entities = await Promise.all(objects.map(async (object) => {
            if (this.hasPrimaryKeyAttrs(object)) {
                let pks = this.filterPrimaryKeys(object);
                if (object.deleted_at) {
                    const obj = await this.findOne({where: pks});
                    if (obj) {
                        obj.destroy()
                    }
                    return null;
                } else {
                    const updatedObj = await this.update(object, {
                        where: pks,
                        returning: true
                    });
                    if (updatedObj[0] == 0) {
                        return null;
                    }
                    return updatedObj[1][0];
                }
            } else {
                if (object.deleted_at) {
                    return null;
                } else {
                    return this.create(object);
                }
            }
        }) as Promise<any>[]);

        entities = entities.filter((e) => !!e);
        return multiple ? entities : (entities.length > 0 ? entities[0] : null);

    };

    sequelize.Model.deepUpsert = async function (objects) {
        let multiple = Array.isArray(objects);
        objects = multiple ? objects : new Array(objects);
        let entities = await Promise.all(objects.map(async (object) => {
            if (this.hasOnlyPkAttrs(object)) {
                return this.create(object);
            }

            const entity = await this.bulkUpsert(this.filterAttributes(object));

            await Promise.all(this.filterAssociations(object).map(async (pair) => {
                const otherEntities = await pair.association.target.deepUpsert(pair.objects);
                console.log(otherEntities, typeof otherEntities);
                let otherEntitiesRefs = Array.isArray(otherEntities)
                    ? otherEntities.map(e => e.get('id'))
                    : otherEntities.get('id');

                await entity[pair.association.accessors.set](otherEntitiesRefs.filter(o => !this.hasOnlyPkAttrs(o)));
                entity.set(pair.association.as, otherEntities, {raw: true});
                return entity;
            }));

            return entity;
        }) as Promise<any>[]);
        entities = entities.filter((e) => !!e);
        return multiple ? entities : (entities.length > 0 ? entities[0] : null);

    };


}