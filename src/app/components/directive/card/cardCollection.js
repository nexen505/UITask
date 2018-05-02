export class CardCollection {

  static cardMapper(elm) {
    return {
      obj: elm,
      active: false
    };
  }

  constructor(collection = []) {
    this._cards = collection.map(CardCollection.cardMapper);
  }

  get cards() {
    return this._cards;
  }

  open(card) {
    this.toggle(card, true);
  }

  close(card) {
    this.toggle(card, false);
  }

  toggle(cardToToggle, value = !cardToToggle.active) {
    this.cards.forEach((card) => {
      if (card !== cardToToggle && card.active) {
        card.active = false;
      }
    });
    cardToToggle.active = value;
  }

  isActive(card) {
    return card.active;
  }

  hasActive() {
    return !!this.cards.find(this.isActive);
  }

  push(items) {
    this.cards.push(...items.map(CardCollection.cardMapper));
  }

  remove(card) {
    const idx = this.cards.indexOf(card);

    if (idx !== -1) {
      this.cards.splice(idx, 1);
    }
  }
}
