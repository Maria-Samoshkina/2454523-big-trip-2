import {render, replace, remove} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import { RenderPosition } from '../framework/render.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #tripInfoComponent = null;

  constructor ({tripInfoContainer, pointsModel, offersModel,destinationsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);

  }

  init() {
    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({
      points: this.#pointsModel.getPoints(),
      offers: this.#offersModel.getOffers(),
      destinations: this.#destinationsModel.getDestinations()
    });


    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };
}
