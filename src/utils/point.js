import { calculateDurationInMilliseconds } from './date.js';
import dayjs from 'dayjs';

function getOffersForPoint (point, offers) {

  const pointTypeOffer = offers.find((offer) => offer.type === point.type);

  if (!pointTypeOffer) {
    return '';
  }
  return pointTypeOffer;
}

function getDestinationForPoint (point, destinations) {

  const destinationData = destinations.find((destination) => destination.id === point.destination);

  if (!destinationData) {
    return '';
  }
  return destinationData;
}

function getWeightForNullPrice(priceA, priceB) {
  if (priceA === null && priceB === null) {
    return 0;
  }

  if (priceA === null) {
    return 1;
  }

  if (priceB === null) {
    return -1;
  }

  return null;
}

function sortPriceDown(pointA, pointB) {
  const weight = getWeightForNullPrice(pointA.basePrice, pointB.basePrice);
  return weight !== null ? weight : pointB.basePrice - pointA.basePrice;
}


function getWeightForNullTimeDuration (timeDurationA, timeDurationB) {
  if (timeDurationA === null && timeDurationB === null) {
    return 0;
  }

  if (timeDurationA === null) {
    return 1;
  }

  if (timeDurationB === null) {
    return -1;
  }

  return null;
}

function sortTimeDurationDown(pointA, pointB) {
  const timeDurationA = calculateDurationInMilliseconds(pointA);
  const timeDurationB = calculateDurationInMilliseconds(pointB);
  const weight = getWeightForNullTimeDuration(timeDurationA, timeDurationB);

  return weight !== null ? weight : timeDurationB - timeDurationA;
}

function getWeightForNullDateFrom(dateFromA, dateFromB) {
  if (dateFromA === null && dateFromB === null) {
    return 0;
  }

  if (dateFromA === null) {
    return 1;
  }

  if (dateFromB === null) {
    return -1;
  }

  return null;
}

function sortDateFromUp(pointA, pointB) {
  const weight = getWeightForNullDateFrom(pointA.dateFrom, pointB.dateFrom);

  return weight !== null ? weight : dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}
export {getOffersForPoint, getDestinationForPoint,sortPriceDown, sortTimeDurationDown,sortDateFromUp };
