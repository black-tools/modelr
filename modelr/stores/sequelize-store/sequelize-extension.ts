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
        const keys = Object.keys(obj);
        return !keys.some(k => pks.indexOf(k) < 0)
            && pks.every(pk => keys.indexOf(pk) >= 0);
    };

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


    //TODO make this more efficient.
    sequelize.Model.filterAttributes = function (object) {
        let attributes = this.rawAttributes as { [key: string]: any }[];
        let associations = this.associations as { [key: string]: any }[];
        let filteredObject = {};
        for (let [key, attr] of Object.entries(attributes)) {
            if (object.hasOwnProperty(attr.fieldName)) {
                filteredObject[attr.fieldName] = object[attr.fieldName];
            }
        }

        //TODO generalize this.
        for (let [key, assoc] of Object.entries(associations)) {
            if (assoc.constructor.name === 'BelongsTo') {
                if (object[key] && object[key].id) {
                    filteredObject[assoc.foreignKey] = object[key].id;
                }
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
                return this.build(object);
            }

            const entity = await this.bulkUpsert(this.filterAttributes(object));

            await Promise.all(this.filterAssociations(object).map(async (pair) => {
                const otherEntities = await pair.association.target.deepUpsert(pair.objects);


                //TODO generalize this.
                const refs = Array.isArray(otherEntities) ?
                    otherEntities.map(e => e.get('id')) :
                    otherEntities.get('id');

                await entity[pair.association.accessors.set](refs);
                entity.set(pair.association.as, otherEntities, {raw: true});

                return entity;
            }));

            return entity;
        }) as Promise<any>[]);
        entities = entities.filter((e) => !!e);
        return multiple ? entities : (entities.length > 0 ? entities[0] : null);

    };


}