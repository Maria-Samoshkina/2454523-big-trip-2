import SortView from '../view/sort-view.js';
import TripEventView from '../view/trip-event-view.js';
import NewPointPresenter from './new-point-presenter.js';
import TripEventListView from '../view/trip-event-list-view.js';
import {remove, render,RenderPosition} from '../framework/render.js';
import NoPointView from '../view/no-point-view.js';
import NoDataView from '../view/no-data-view.js';
import LoadingView from '../view/loading-view.js';
import PointPresenter from './point-presenter.js';
import { SortType, UserAction, UpdateType, FilterType, NoDataType } from '../const.js';

export default class TripEventPresenter {
  #tripEventsContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #tripEventComponent = new TripEventView();
  #tripEventListComponent = new TripEventListView();
  #loadingComponent = new LoadingView();
  #noPointComponent = null;
  #noDataComponent = null;
  #sortComponent = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor ({tripEventsContainer,pointsModel, destinationsModel, offersModel, filterModel, onNewPointDestroy}) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#tripEventListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });


    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

  }

  get points() {
    return this.#pointsModel.filteredAndSortedPoints(this.#currentSortType, this.#filterModel.filter);
  }


  init () {
    this.#renderBoard();
  }

  createPoint () {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(this.#offersModel.offers, this.#destinationsModel.destinations);
  }


  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }

  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data, this.#offersModel.offers, this.#destinationsModel.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort () {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#tripEventComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point, offers, destinations) {
    const pointPresenter = new PointPresenter({
      tripEventListComponent: this.#tripEventListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point, offers, destinations);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderLoading() {
    render(this.#loadingComponent,this.#tripEventComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints () {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });
    render(this.#noPointComponent,this.#tripEventComponent.element,RenderPosition.AFTERBEGIN);
  }

  #renderNoData (noDataType) {
    this.#noDataComponent = new NoDataView({
      noDataType: noDataType
    });
    render(this.#noDataComponent,this.#tripEventComponent.element,RenderPosition.AFTERBEGIN);
  }

  #clearBoard ({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if(this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType){
      this.#currentSortType = SortType.DAY;
    }

  }

  #renderBoard () {
    render(this.#tripEventComponent, this.#tripEventsContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    if (this.#offersModel.offers.length === 0) {
      this.#renderNoData(NoDataType.OFFERS);
      return;
    }

    if (this.#destinationsModel.destinations.length === 0) {
      this.#renderNoData(NoDataType.DESTINATIONS);
      return;
    }

    this.#renderSort();
    render(this.#tripEventListComponent,this.#tripEventComponent.element);
    for (let i = 0; i < this.points.length; i++) {
      this.#renderPoint(this.points[i], this.#offersModel.offers, this.#destinationsModel.destinations);
    }
  }

}
