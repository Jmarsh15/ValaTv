export const userFound = (user) => dispatch => {
    dispatch({
      type: 'USER',
      payload: user
    });
  }
export const userDataFound = (user) => dispatch => {
    dispatch({
      type: 'USER_DATA',
      payload: user
    });
  }
