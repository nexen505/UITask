import { Utils } from "../utils/utils.service";

export class UserAchievement {
  constructor(id = Utils.uuid(), comment = null, date = Date.now(), achievement = null, user = null) {
    this._id = id;
    this._comment = comment;
    this._date = date;
    this._achievement = achievement;
    this._user = user;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get comment() {
    return this._comment;
  }

  set comment(value) {
    this._comment = value;
  }

  get date() {
    return this._date;
  }

  set date(value) {
    this._date = value;
  }

  get achievement() {
    return this._achievement;
  }

  set achievement(value) {
    this._achievement = value;
  }

  get user() {
    return this._user;
  }

  set user(value) {
    this._user = value;
  }

  toObject() {
    return {
      id: this.id,
      comment: this.comment,
      date: this.date,
      userId: this.user ? this.user.id : null,
      achievementId: this.achievement ? this.achievement.id : null
    };
  }
}
