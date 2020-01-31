import axios from "axios";

function resultAction(search) {
  return (dispatch, getState) => {
    const searchReq = search.map(s => {
      return {
        id: s.field.id,
        value: s.value
      };
    });

    let payload = new FormData();
    payload.set("user", "");
    payload.set("search", JSON.stringify(searchReq));
    payload.set("REQUEST_METHOD", "GET");

    axios.post("http://localhost/INI/pcto-anagrafe/api/company/", payload)
      .then(res => {
        if(res.status === 200) {
          const results = res.data;
          console.log(results);
          dispatch({
            type: "UPDATE_RESULTS",
            results,
          });
        }
      });

    // GET /api/company
    // let results = [
    //   {
    //     id: 2,
    //     name: "Practiquemos",
    //     fields: [
    //       {id: 1, name: "telefono", regex: "\\d{3} \\d{3} \\d{4}", value:"123 456 7890"},
    //       {id: 2, name: "email", regex: "[a-zA-Z0-9.!#$%&’*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*", value:"cmverona@gmail.com"},
    //     ],
    //   },
    //   {
    //     id: 3,
    //     name: "NetSysCo S.r.l",
    //     fields: [
    //       {id: 1, name: "telefono", regex: "\\d{3} \\d{3} \\d{4}", value:"111 222 3333"},
    //       {id: 2, name: "email", regex: "[a-zA-Z0-9.!#$%&’*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*", value:"netsysco@gmail.com"},
    //     ],
    //   },
    //   {
    //     id: 4,
    //     name: "TuringArena",
    //     fields: [
    //       {id: 2, name: "email", regex: "[a-zA-Z0-9.!#$%&’*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*", value:"cairomax@gmail.com"},
    //     ],
    //   },
    // ];

    // dispatch({
    //   type: "UPDATE_RESULTS",
    //   results
    // });
  }
}

export default resultAction;
