export class UserAchievement {
  constructor(id, comment, date, achievement) {

    this._id = id;
    this._comment = comment;
    this._date = date;
    this._achievement = achievement;
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
}
