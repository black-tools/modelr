export function extendSequelize(sequelize) {


    sequelize.Model.hasPrimaryKeyAttrs = function (obj) {
        let pks = this.primaryKeyAttributes;
        return pks.some((pk) => obj.hasOwnProperty(pk) && obj[pk]);
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

    sequelize.Model.bulkUpsert = function (objects) {
        let multiple = Array.isArray(objects);
        objects = multiple ? objects : new Array(objects);

        return Promise.all(objects.map((object) => {
            if (this.hasPrimaryKeyAttrs(object)) {
                let pks = this.filterPrimaryKeys(object);
                if (object.deleted_at) {
                    return this.findOne({where: pks})
                        .then((entity) => {
                            return entity.destroy()
                                .then((ret) => {
                                    return null;
                                })
                        })
                } else {
                    return this.findOne({where: pks})
                        .then(entity => entity.updateAttributes(object))
                }
            } else {
                if (object.deleted_at) {
                    return null;
                } else {
                    return this.create(object);
                }
            }
        }))
            .then((entities: any[]) => {
                entities = entities.filter((e) => !!e);
                return multiple ? entities : (entities.length > 0 ? entities[0] : null);
            })
    };

    sequelize.Model.deepUpsert = function (objects) {
        let multiple = Array.isArray(objects);
        objects = multiple ? objects : new Array(objects);
        return Promise
            .all(objects.map((object) => {
                return this
                    .bulkUpsert(this.filterAttributes(object))
                    .then((entity) => {
                        return Promise
                            .all(this.filterAssociations(object).map((pair) => {
                                return pair.association.target
                                    .deepUpsert(pair.objects)
                                    .then((otherEntities) => {
                                        let otherEntitiesRefs = Array.isArray(otherEntities) ? otherEntities.map(e => e.get('id'))
                                            : otherEntities.get('id');

                                        return entity[pair.association.accessors.set](otherEntitiesRefs)
                                            .then(() => {
                                                entity.set(pair.association.as, otherEntities, {raw: true});
                                                return entity;
                                            })
                                    })
                            }))
                            .then(() => {
                                return entity;
                            })
                    })

            }))
            .then((entities: any[]) => {
                entities = entities.filter((e) => !!e);
                return multiple ? entities : (entities.length > 0 ? entities[0] : null);
            })

    };


    //
    sequelize.Model.getInclude = function (fields) {

    }

}