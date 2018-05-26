import { Utils } from "./components/utils/utils.service";

export function ArchivedNameFilter(_) {
  return (arr = [], archived = false, nameKey = 'name', nameToSearch = null) => {
    return arr.filter((elm) => {
      const elmName = _.get(elm, nameKey, null);

      return elm.archived === archived && (Utils.isEmpty(nameToSearch) || (!Utils.isEmpty(elmName) && elmName.indexOf(nameToSearch) !== -1));
    });
  };
}
