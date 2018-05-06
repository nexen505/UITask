import { Utils } from "../utils/utils.service";

export class Achievement {
  constructor(id = Utils.uuid(), name = null, description = null, karma = 0, icon = null, archived = false, users = []) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._karma = karma;
    this._icon = icon;
    this._archived = archived;
    this._users = users;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this._description = value;
  }

  get karma() {
    return this._karma;
  }

  set karma(value) {
    this._karma = value;
  }

  get archived() {
    return this._archived;
  }

  set archived(value) {
    this._archived = value;
  }

  get icon() {
    return this._icon;
  }

  set icon(value) {
    this._icon = value;
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      karma: this.karma,
      icon: this.icon,
      archived: this.archived
    };
  }

}
