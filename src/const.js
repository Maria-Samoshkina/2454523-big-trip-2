const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';
const DATETIME_FORMAT_FOR_EDIT_FORM = 'DD/MM/YY HH:mm';

const SortType = {
  DAY:'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const SORT_TYPE_DISABLED = ['event', 'offers'];

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  ERROR: 'ERROR'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE:'future',
  PRESENT: 'present',
  PAST: 'past',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
  INIT: 'INIT'
};


const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {POINT_TYPES,
  DATE_FORMAT,
  TIME_FORMAT,
  DATETIME_FORMAT,
  DATETIME_FORMAT_FOR_EDIT_FORM,
  SortType, SORT_TYPE_DISABLED,
  UserAction,
  UpdateType,
  FilterType,
  Method,
  TimeLimit};

