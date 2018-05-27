import { Utils } from "./components/utils/utils.service";

function archivedCriteria(_, archivedCriterions, elm, archivedKey, archived) {
  return archived === archivedCriterions.ALL || _.get(elm, archivedKey, null) === (archived === archivedCriterions.ARCHIVED);
}

export function ArchivedFilter(_, archivedCriterions) {
  'ngInject';

  return (arr = [], archivedKey = 'obj.archived', archived = archivedCriterions.NOT_ARCHIVED) => {
    return arr.filter((elm) => {
      return archivedCriteria(_, archivedCriterions, elm, archivedKey, archived);
    });
  };
}

export function ArchivedNameFilter(_, archivedCriterions) {
  'ngInject';

  return (arr = [], archivedKey = 'obj.archived', archived = archivedCriterions.NOT_ARCHIVED, nameKey = 'obj.name', nameToSearch = null) => {
    return arr.filter((elm) => {
      const elmName = _.get(elm, nameKey, null),
        archivedCriterion = archivedCriteria(_, archivedCriterions, elm, archivedKey, archived),
        nameCriterion = (Utils.isEmpty(nameToSearch) || (!Utils.isEmpty(elmName) && elmName.indexOf(nameToSearch) !== -1));

      return archivedCriterion && nameCriterion;
    });
  };
}
