import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_TYPES, DATETIME_FORMAT_FOR_EDIT_FORM } from '../const.js';
import { humanizeDate } from '../utils/date.js';
import { getFormattedType } from '../utils/common.js';
import {getOffersForPoint, isValidPrice} from '../utils/point.js';
import {getDestinationForPoint, getNameOfDestinations} from '../utils/point.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  type: 'flight',
  destination: '',
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  isFavorite: false,
  offers: [],
};

function createPointTypeTemplate (isDisabled) {
  return POINT_TYPES.map((type)=> `<div class="event__type-item">
<input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isDisabled ? 'disabled' : ''}>
<label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${getFormattedType(type)}</label>
</div> `).join('');
}

function createOffersTemplate(point, offers) {
  const pointTypeOffer = getOffersForPoint(point,offers);

  if (!pointTypeOffer?.offers?.length) {
    return '';
  }

  const {isDisabled} = point;

  const pointAllOffers = pointTypeOffer.offers.map((offer) => {

    const checked = point.offers.includes(offer.id) ? 'checked' : '';
    const {title, price,id} = offer;
    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="event-offer-${id}" ${checked} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`;
  }
  );


  return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
    ${pointAllOffers.join('')}
  </div>
  </section>`;
}

function createDestinationOptionTemplate (destinations,isDisabled) {
  const nameOfDestinations = getNameOfDestinations(destinations);
  return nameOfDestinations.map((destination)=>`<option value="${destination}" ${isDisabled ? 'disabled' : ''}></option>`).join('');
}

function createDescriptionOfDestinationTemplate (point,destinations) {
  const destinationData = getDestinationForPoint(point, destinations);
  if (point.destination === '' || destinationData.description === '') {
    return '';
  }

  const {description, pictures} = destinationData;
  const photoOfDestination = pictures.map((picture) => `<img class="event__photo" src=${picture.src} alt="Event photo"></img>`);
  return `<section class="event__section  event__section--destination">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description">${description}</p>

                  ${pictures.length ? `
                  <div class="event__photos-container">
                    <div class="event__photos-tape">
                   ${photoOfDestination}
                    </div>
                  </div>
                  ` : ''}
                </section>
             `;
}

function createEventTypeTemplate (point) {

  const {type, isDisabled} = point;
  const typeTemplate = createPointTypeTemplate(isDisabled);

  return `<div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typeTemplate}
            </fieldset>
          </div>
        </div>`;
}

function createFieldGroupDestinationTemplate (point, destinations) {

  const {type, isDisabled} = point;
  const destinationData = getDestinationForPoint(point, destinations);
  let {name} = destinationData;
  if (point.destination === '') {
    name = '';
  }
  const destinationTemplate = createDestinationOptionTemplate(destinations,isDisabled);

  return `<div class="event__field-group  event__field-group--destination">
  <label class="event__label  event__type-output" for="event-destination-1">
    ${type}
  </label>
  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1" autocomplete="off" ${isDisabled ? 'disabled' : ''}>
  <datalist id="destination-list-1">
  ${destinationTemplate}
  </datalist>
</div>`;
}

function createFieldEventDateTemplate (point) {

  const {dateTo, dateFrom, isDisabled} = point;

  return `<div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom,DATETIME_FORMAT_FOR_EDIT_FORM)}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, DATETIME_FORMAT_FOR_EDIT_FORM)}" ${isDisabled ? 'disabled' : ''}>
        </div>`;
}

function createFieldEventPriceTemplate (point) {

  const {basePrice, isDisabled} = point;
  if (basePrice === '') {
    return `<div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="" ${isDisabled ? 'disabled' : ''}>
        </div>`;
  }
  const isPriceNotCorrect = !isValidPrice(basePrice);

  return `<div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}"
          style="border: ${isPriceNotCorrect ? '2px solid red' : 'none'}" ${isDisabled ? 'disabled' : ''}>
          ${isPriceNotCorrect ? '<p class="event__error-message">Price must be a positive integer.</p>' : ''}
        </div>`;
}

function createCreationFormTemplate (point, offers, destinations) {
  const offerTemplate = createOffersTemplate(point, offers);
  const descriptionOfDestinationTemplate = createDescriptionOfDestinationTemplate(point, destinations);
  const {basePrice, dateFrom, dateTo, isDisabled, isSaving} = point;

  const isPriceNotCorrect = !isValidPrice(basePrice);

  const dateFromInMilliseconds = dateFrom ? dateFrom.getTime() : 0;
  const dateToInMilliseconds = dateTo ? dateTo.getTime() : 0;


  const isDateToNotCorrect = dateToInMilliseconds < dateFromInMilliseconds;

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
${createEventTypeTemplate(point)}
${createFieldGroupDestinationTemplate(point, destinations)}
${createFieldEventDateTemplate(point)}
${createFieldEventPriceTemplate(point)}
        <button class="event__save-btn  btn  btn--blue" type="submit" ${isPriceNotCorrect || isDisabled || isDateToNotCorrect ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
            ${offerTemplate}

      ${descriptionOfDestinationTemplate}
      </section>
    </form>
  </li>`
  );
}

export default class CreatePointView extends AbstractStatefulView {
  #offers = [];
  #destinations = [];
  #handleForSubmit = null;
  #handleDeleteClick = null;
  #startDatepicker = null;
  #endDatepicker = null;

  constructor ({point = BLANK_POINT, offers, destinations,onFormSubmit, onDeleteClick}) {
    super();
    this._setState(CreatePointView.parsePointToState(point));
    this.#offers = offers;
    this.#destinations = destinations;
    this. #handleForSubmit = onFormSubmit;
    this._restoreHandlers();
    this.#handleDeleteClick = onDeleteClick;
  }

  get template () {
    return createCreationFormTemplate(this._state, this.#offers, this.#destinations);
  }

  removeElement() {
    super.removeElement();
    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }
    if (this.#endDatepicker) {
      this.#endDatepicker.destroy();
      this.#endDatepicker = null;
    }
  }

  reset (point) {
    this.updateElement(CreatePointView.parsePointToState(point));
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-list').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);

    this.element.addEventListener('change', (evt) => {
      if (evt.target.classList.contains('event__offer-checkbox')) {
        this.#offerChangeHandler(evt);
      }
    });

    this.element.addEventListener('click', (evt) => {
      const offerSelector = evt.target.closest('.event__offer-selector');

      if (offerSelector) {
        const checkboxElement = offerSelector.querySelector('.event__offer-checkbox');

        if (checkboxElement) {
          checkboxElement.checked = !checkboxElement.checked;
          checkboxElement.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      if (evt.target.classList.contains('event__offer-checkbox')) {
        this.#offerChangeHandler(evt);
      }
    });

    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.#setStartDatepicker();
    this.#setEndDatepicker();
  }


  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this. #handleForSubmit(CreatePointView.parseStateToPoint(this._state), this.#offers, this.#destinations);

  };

  #offerChangeHandler = (evt) => {

    evt.preventDefault();
    const selectedOfferId = evt.target.id;
    const isChecked = evt.target.checked;

    let newOffers;

    if (isChecked && !this._state.offers.includes(selectedOfferId)) {
      newOffers = [...this._state.offers, selectedOfferId];
    } else if (!isChecked) {
      newOffers = this._state.offers.filter((offer) => offer !== selectedOfferId);
    } else {
      newOffers = this._state.offers;
    }

    this.updateElement({
      offers: newOffers,
    });

  };

  #typeChangeHandler = (evt)=> {
    evt.preventDefault();
    const newType = evt.target.value;
    this.updateElement({
      type: newType,
      offers: [],
    });

  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const newDestination = evt.target.value;
    const nameOfDestinations = getNameOfDestinations(this.#destinations);
    if (!nameOfDestinations.includes(newDestination)) {
      evt.target.value = '';
      return;
    }
    const destinationData = this.#destinations.find((destination)=> destination.name === newDestination);
    this.updateElement({
      destination: destinationData.id,
    });

  };

  #startDateChangeHandler = ([userDate]) => {
    this.#endDatepicker.set('minDate', userDate);
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #endDateChangeHandler = ([userDate]) => {
    this.#startDatepicker.set('maxDate', userDate);
    this.updateElement({
      dateTo: userDate,
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    const newPrice = evt.target.value;
    this.updateElement({
      basePrice: newPrice
    });

  };

  #setStartDatepicker () {
    this.#startDatepicker = flatpickr (
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onClose: this.#startDateChangeHandler

      }
    );
  }

  #setEndDatepicker () {
    this.#endDatepicker = flatpickr (
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onClose: this.#endDateChangeHandler

      }
    );
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(CreatePointView.parseStateToPoint(this._state));
  };

  static parsePointToState (point) {
    return {...point,
      isDisabled: false,
      isSaving: false,
    };

  }

  static parseStateToPoint (state) {
    const point = {...state};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
