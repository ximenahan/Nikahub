export class Canvas {
    constructor(id, name, createdAt, cards = []) {
      this.id = id;
      this.name = name;
      this.createdAt = createdAt;
      this.cards = cards;
    }
  }
  