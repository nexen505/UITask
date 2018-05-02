import { Utils } from "../utils/utils.service";

export class User {
  constructor(id = Utils.uuid(), name = null, bio = null, photo = null, archived = false, achievements = []) {
    this._id = id;
    this._name = name;
    this._bio = bio;
    this._photo = photo;
    this._archived = archived;
    this._achievements = achievements;
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

  get bio() {
    return this._bio;
  }

  set bio(value) {
    this._bio = value;
  }

  get photo() {
    return this._photo;
  }

  set photo(value) {
    this._photo = value;
  }

  get archived() {
    return this._archived;
  }

  set archived(value) {
    this._archived = value;
  }

  get achievements() {
    return this._achievements;
  }

  set achievements(value) {
    this._achievements = value;
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      bio: this.bio,
      photo: this.photo,
      archived: this.archived
    };
  }
}
