
export function updateStructure(fields) {
  return (dispatch, getState) => {

  }
}

export function initStructure() {
  return (dispatch, getState) => {
    // GET /api/structure
    const fields = [
      {id: 0, name: "Nome", regex: ".+"},
      {id: 1, name: "Telefono", regex: "\\d{3} \\d{3} \\d{4}"},
      {id: 2, name: "E-Mail", regex: "[a-zA-Z0-9.]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*"},
    ];

    dispatch({
      type: "UPDATE_STRUCTURE",
      fields,
    });
  }
}
