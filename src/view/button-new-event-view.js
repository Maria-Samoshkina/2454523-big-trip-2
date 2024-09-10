import AbstractView from '../framework/view/abstract-view.js';

function createButtonNewEventTemplate () {
  return ('<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>');
}

export default class ButtonNewEventView extends AbstractView {
  #handleClick = null;

  constructor ({onClick}) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }


  get template () {
    return createButtonNewEventTemplate();
  }

  #clickHandler = (evt) => {
    debugger;
    evt.preventDefault();
    this.#handleClick();
  };

}
