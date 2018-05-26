export class Card {
  constructor(obj = null, $active = false) {
    this._obj = obj;
    this._$active = $active;
  }

  get obj() {
    return this._obj;
  }

  set obj(value) {
    this._obj = value;
  }

  get $active() {
    return this._$active;
  }

  set $active(value) {
    this._$active = value;
  }
}

export class CardCollection {

  constructor(collection = []) {
    this._cards = [];
    if (collection) {
      this.push(...collection);
    }
  }

  get cards() {
    return this._cards;
  }

  static cardMapper(elm) {
    return new Card(elm);
  }

  open(card) {
    this.toggle(card, true);
  }

  close(card) {
    if (card) {
      this.toggle(card, false);
    } else {
      this.cards.forEach((c) => (c.$active = false));
    }
  }

  toggle(cardToToggle, value = !cardToToggle.$active) {
    this.cards.forEach((card) => {
      if (card !== cardToToggle && card.$active) {
        card.$active = false;
      }
    });
    cardToToggle.$active = value;
  }

  hasActive() {
    return !!this.cards.find((card) => card.$active);
  }

  push(...items) {
    this.cards.push(...items.map(CardCollection.cardMapper));
  }

  remove(card) {
    const idx = this.cards.indexOf(card);

    if (idx !== -1) {
      this.cards.splice(idx, 1);
    }
  }
}
