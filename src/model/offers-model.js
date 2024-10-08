import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offersApiService = null;
  #offers = [];

  constructor ({offersApiService}) {
    super();
    this.#offersApiService = offersApiService;

  }

  getOffers() {
    return this.#offers;
  }

  async init() {
    try {
      this.#offers = await this.#offersApiService.offers;

    } catch(err) {
      this.#offers = [];
    }
  }
}
