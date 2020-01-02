import Immutable from 'immutable';
import {
  gotEntity,
  clearEntity,
  updateEntityField,
  deleteEntityField,
  importEntities,
} from './entityActions';

const defaultImporter = Immutable.Map({
  map: Immutable.Map(),
  fileDelimiter: ',',
});

export const initImporter = () => gotEntity('importer', defaultImporter);

export const deleteImporter = () => clearEntity('importer');

export const updateImporterValue = (path, value) => updateEntityField('importer', path, value);

export const deleteImporterValue = path => deleteEntityField('importer', path);

export const sendImport = (collection, items, operation) => importEntities(collection, items, operation);
