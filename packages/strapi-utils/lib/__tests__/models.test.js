const modelUtils = require('../models');

global.strapi = {
  log: {
    error() {},
  },
  stop() {},
  plugins: {
    plugin1: {
      models: {
        someModel: {},
      },
    },
  },
  models: {
    test: {
      orm: 'bookshelf',
      attributes: {
        attr1: {
          collection: 'other',
          via: 'attr1',
        },
        attr3: {
          model: 'other',
          via: 'attr3',
        },
        attr4: {
          model: 'other',
          via: 'attr4',
        },
        attr6: {
          model: '*',
        },
        attr7: {
          model: '*',
        },
        attr8: {
          collection: '*',
        },
        attr9: {
          collection: '*',
        },
        attr10: {
          model: 'other',
          via: 'attr10',
        },
        attr11: {
          model: 'other',
        },
        attr12: {
          model: 'other',
        },
        attr13: {
          model: 'other',
          via: 'attr13',
        },
        attr14: {
          collection: 'other',
          via: 'attr14',
        },
        attr15: {
          collection: 'other',
          via: 'attr15',
        },
        attr16: {
          collection: 'other',
          via: 'attr16',
        },
        attr17: {
          collection: 'other',
        },
        attr18: {
          collection: 'other',
        },
        attr19: {
          model: 'other',
        },
        attr20: {
          model: 'other',
          plugin: 'plugins1',
        },
        attr21: {
          collection: 'model1',
        },
      },
    },
    model1: {
      attributes: {
        attr1: {
          via: 'attr21',
          model: 'test',
        },
      },
    },
    other: {
      attributes: {
        attr1: {
          collection: '*',
        },
        attr3: {
          collection: 'test',
        },
        attr4: {
          model: '*',
        },
        attr6: {
          model: 'test',
          collection: 'test',
          via: 'attr6',
        },
        attr7: {
          model: 'test',
          via: 'attr7',
        },
        attr8: {
          model: 'test',
          via: 'attr8',
        },
        attr9: {
          collection: 'test',
          model: 'test',
          via: 'attr9',
        },
        attr10: {
          model: 'test',
        },
        attr11: {
          model: 'test',
          via: 'attr11',
        },
        attr12: {
          collection: 'test',
          via: 'attr12',
        },
        attr13: {
          via: 'attr13',
          collection: 'test',
        },
        attr14: {
          model: 'test',
        },
        attr15: {
          collection: 'test',
          via: 'attr15',
        },
        attr16: {
          collection: 'test',
        },
        attr17: {
          collection: 'test',
          via: 'attr17',
        },
      },
    },
  },
};

describe('Models utils', () => {
  test('Dummy Initialize function call callback', () => {
    const cb = jest.fn();
    modelUtils.initialize(cb);
    expect(cb).toBeCalled();
  });

  describe('Get PK', () => {
    test('Returns undefined on invalid input', () => {
      expect(modelUtils.getPK()).toBeUndefined();
    });

    test('Calls models.getOrm', () => {
      const oldOrmFn = modelUtils.getORM;
      modelUtils.getORM = jest.fn(() => 'bookshelf');
      expect(modelUtils.getPK('test')).toBeUndefined();
      modelUtils.getORM = oldOrmFn;
    });
  });

  describe('getValuerimaryKey', () => {
    test('Returns defaultKey\'s value', () => {
      const o = {
        defKey: 'val',
      };

      expect(modelUtils.getValuePrimaryKey(o, 'defKey')).toBe('val');
    });

    test('Returns id then _id if no default key', () => {
      expect(modelUtils.getValuePrimaryKey({ id: 1 })).toBe(1);
      expect(modelUtils.getValuePrimaryKey({ id: 1 }, 'defKey')).toBe(1);

      expect(modelUtils.getValuePrimaryKey({ _id: 2 })).toBe(2);
      expect(modelUtils.getValuePrimaryKey({ _id: 2 }, 'defKey')).toBe(2);
    });
  });

  describe('getCount', () => {
    test('Returns undefined on invalid input', () => {
      expect(modelUtils.getCount()).toBeUndefined();
    });

    test('Calls models.getOrm', () => {
      const oldOrmFn = modelUtils.getORM;
      modelUtils.getORM = jest.fn(() => 'bookshelf');
      expect(modelUtils.getCount('test')).toBeUndefined();
      modelUtils.getORM = oldOrmFn;
    });
  });

  describe('getORM', () => {
    test('Returns valid value', () => {
      expect(modelUtils.getORM('test')).toBe('bookshelf');
    });

    test('Throws when no collectionName is provided', () => {
      expect(() => modelUtils.getORM()).toThrow();
    });
  });

  describe('getVia', () => {
    test('Returns right attribute', () => {
      expect(
        modelUtils.getVia('test', {
          model: 'test',
        })
      ).toBe('attr1');
    });

    test('Throws on invalid input', () => {
      expect(() => modelUtils.getVia('meuh')).toThrow();
    });
  });

  describe('getNature', () => {
    test('1', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr1, 'attr1', undefined, 'test')
      ).toEqual({
        nature: 'manyToManyMorph',
        verbose: 'morphMany',
      });
    });

    // usecase not possible
    test('2', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr2, 'attr2', undefined, 'test')
      ).toEqual({
        nature: 'manyToOneMorph',
        verbose: 'morphMany',
      });
    });

    test('3', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr3, 'attr3', undefined, 'test')
      ).toEqual({
        nature: 'oneToManyMorph',
        verbose: 'morphOne',
      });
    });

    test('3.bis', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr4, 'attr4', undefined, 'test')
      ).toEqual({
        nature: 'oneToManyMorph',
        verbose: 'morphOne',
      });
    });

    // not possible
    test('4', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr5, 'attr5', undefined, 'test')
      ).toEqual({
        nature: 'oneToOneMorph',
        verbose: 'morphOne',
      });
    });

    test('5', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr6, 'attr6', undefined, 'test')
      ).toEqual({
        nature: 'oneMorphToMany',
        verbose: 'belongsToMorph',
      });
    });

    test('6', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr7, 'attr7', undefined, 'test')
      ).toEqual({
        nature: 'oneMorphToOne',
        verbose: 'belongsToMorph',
      });
    });

    test('7', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr8, 'attr8', undefined, 'test')
      ).toEqual({
        nature: 'manyMorphToOne',
        verbose: 'belongsToManyMorph',
      });
    });

    test('8', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr9, 'attr9', undefined, 'test')
      ).toEqual({
        nature: 'manyMorphToMany',
        verbose: 'belongsToManyMorph',
      });
    });

    test('9', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr10, 'attr10', undefined, 'test')
      ).toEqual({
        nature: 'oneToOne',
        verbose: 'belongsTo',
      });
    });

    test('10', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr11, 'attr11', undefined, 'test')
      ).toEqual({
        nature: 'oneToOne',
        verbose: 'hasOne',
      });
    });

    test('11', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr12, 'attr12', undefined, 'test')
      ).toEqual({
        nature: 'manyToOne',
        verbose: 'belongsTo',
      });
    });

    // Error
    test('12', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr13, 'attr13', undefined, 'test')
      ).toEqual({
        nature: 'oneToMany',
        verbose: 'hasMany',
      });
    });

    // L 316
    test('13', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr14, 'attr14', undefined, 'test')
      ).toEqual({
        nature: 'oneToMany',
        verbose: 'hasMany',
      });
    });

    // L321
    test('14', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr15, 'attr15', undefined, 'test')
      ).toEqual({
        nature: 'manyToMany',
        verbose: 'belongsToMany',
      });
    });

    // L 326
    test('15', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr16, 'attr16', undefined, 'test')
      ).toEqual({
        nature: 'manyToMany',
        verbose: 'belongsToMany',
      });

      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr17, 'attr17', undefined, 'test')
      ).toEqual({
        nature: 'manyToMany',
        verbose: 'belongsToMany',
      });

      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr21, 'attr21', undefined, 'test')
      ).toBeUndefined();
    });

    // L334
    test('16', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr18, 'attr18', undefined, 'test')
      ).toEqual({
        nature: 'manyWay',
        verbose: 'belongsToMany',
      });
    });

    // L339
    test('16', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr19, 'attr19', undefined, 'test')
      ).toEqual({
        nature: 'oneWay',
        verbose: 'belongsTo',
      });
    });

    test('With plugin', () => {
      expect(
        modelUtils.getNature(strapi.models.test.attributes.attr20, 'attr20', undefined, 'test')
      ).toBeUndefined();
    });
  });
});
