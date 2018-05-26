import { Utils } from "./components/utils/utils.service";

export function ArchivedNameFilter(_) {
  'ngInject';
  return (arr = [], archivedKey = 'obj.archived', archived = false, nameKey = 'obj.name', nameToSearch = null) => {
    return arr.filter((elm) => {
      const elmName = _.get(elm, nameKey, null),
        archivedCriterion = _.get(elm, archivedKey, null) === archived,
        nameCriterion = (Utils.isEmpty(nameToSearch) || (!Utils.isEmpty(elmName) && elmName.indexOf(nameToSearch) !== -1));

      return archivedCriterion && nameCriterion;
    });
  };
}
