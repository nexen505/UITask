import { Utils } from "./components/utils/utils.service";

function archivedCriteria(_, archivedCriterions, elm, archivedKey, archived) {
  return archived === archivedCriterions.ALL || _.get(elm, archivedKey, null) === (archived === archivedCriterions.ARCHIVED);
}

export function ArchivedFilter(_, archivedCriterions) {
  'ngInject';

  return (arr = [], {
    archivedKey = 'obj.archived',
    archivedValue = archivedCriterions.NOT_ARCHIVED
  }) => {
    return arr.filter((elm) => {
      return archivedCriteria(_, archivedCriterions, elm, archivedKey, archivedValue);
    });
  };
}

export function ArchivedNameFilter(_, archivedCriterions) {
  'ngInject';

  return (arr = [], {
    archivedKey = 'obj.archived',
    archivedValue = archivedCriterions.NOT_ARCHIVED,
    nameKey = 'obj.name',
    nameValue = null
  }) => {
    return arr.filter((elm) => {
      const elmName = _.get(elm, nameKey, null),
        archivedCriterion = archivedCriteria(_, archivedCriterions, elm, archivedKey, archivedValue),
        nameCriterion = (Utils.isEmpty(nameValue) || (!Utils.isEmpty(elmName) && elmName.toLowerCase().indexOf(nameValue.toLowerCase()) !== -1));

      return archivedCriterion && nameCriterion;
    });
  };
}
