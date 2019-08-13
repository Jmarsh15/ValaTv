export const setUserToken = (userToken) => dispatch => {
    console.log(userToken);
    dispatch({
      type: 'TOKEN',
      payload: userToken
    });
  }
