import FilterView from './view/filter-view.js';
import TripEventPresenter from './presenter/trip-event-presenter.js';
import { render } from './render.js';


const tripMainElement = document.querySelector('.trip-main');
const tripControlsFiltersElement = tripMainElement.querySelector('.trip-controls__filters');
const pageMainElement = document.querySelector('.page-main');
const pageBodyContainerElement = pageMainElement.querySelector('.page-body__container');

const tripEventPresenter = new TripEventPresenter({tripEventsContainer: pageBodyContainerElement});

render(new FilterView(), tripControlsFiltersElement);
tripEventPresenter.init();

