import * as R from 'ramda';


export const dueDatesApplier = payload => {
  return R.applySpec({
    name: R.propOr('', 'name'),
    deadline: R.propOr('', 'deadline'),
    app_url: R.propOr('', 'app_url')
  })(payload)
};
  
export const dueDatesMapper = payload => {
  return R.pipe(
    R.sortBy(R.prop('deadline')),
  R.map(dueDatesApplier)
)(payload)};

export const storiesInDevApplier = payload => {
  return R.applySpec({
    name: R.propOr('', 'name'),
    app_url: R.propOr('', 'app_url')
  })(payload)
};
  
export const storiesInDevMapper = payload => {
  return R.pipe(
  R.filter(R.propEq('started', true)),
  R.filter(R.propEq('completed', false)),
  R.map(storiesInDevApplier)
)(payload)};

export const storyPointsApplier = payload => {
  return R.applySpec({
    name: R.propOr('', 'name'),
    num_points: R.path(['stats', 'num_points']),
    num_points_done: R.path(['stats', 'num_points_done']),
  })(payload)
};
  
export const storyPointsMapper = payload => {
  return R.pipe(
  R.map(storyPointsApplier)
)(payload)};

export const randomPhotosApplier = payload => {
  return R.applySpec({
    photo: R.propOr('', 'largeImageURL'),
    photoLink: R.propOr('', 'pageURL')
  })(payload)
};
  
export const randomPhotosMapper = payload => {
  return R.pipe(
  R.map(randomPhotosApplier)
)(payload)};