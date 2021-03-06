import axios from "axios";

const rules = require("../data/02-rules.json");
const schema = require("../data/03-protected-schema.json");

const port = process.env.REACT_APP_FLUREE_PORT || 8080;
const ledger = process.env.REACT_APP_FLUREE_LEDGER || "example/custome";
const url = `http://localhost:${port}/fdb/${ledger}`;

const instance = axios.create({
  baseURL: url,
});

// Global error handling for axios request
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.log(error);

    switch (error.response.status) {
      default:
        return Promise.reject(error);
    }
  }
);

export function flureeQueryWithoutHeader(query){
  const token = localStorage.getItem("token");
  if (token) {
    return new Promise((resolve, reject) => {
      instance
        .post("/query", query)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
  return new Promise((resolve, reject) => {
    instance
      .post(`/query`, query)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
  
}

/**
 * Helper function to handle Fluree queries
 * @param {Object} query Object containing FlureeQL query
 */
export function flureeQuery(query) {
  const token = localStorage.getItem("token");
  if (token) {
    const authHeader = "Bearer " + token;
    return new Promise((resolve, reject) => {
      instance
        .post("/query", query, { headers: { Authorization: authHeader } })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
  return new Promise((resolve, reject) => {
    instance
      .post(`/query`, query)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

/**
 * Helper function to handle Fluree transactions
 * @param {Array} transactions Should contain Objects, each representing a FlureeQL transaction
 */
export function flureeTransact(transactions) {
  const token = localStorage.getItem("token");
  if (token) {
    return new Promise((resolve, reject) => {
      instance
        .post("/transact", transactions, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
  return new Promise((resolve, reject) => {
    instance
      .post(`/transact`, transactions)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

/**
 * Register user in Fluree database using password auth API
 * @param {Array} user Array containing user object transactions
 * link to "pw/generate" docs: https://docs.flur.ee/api/downloaded-endpoints/downloaded-examples#-generate
 */
export function registerFlureeUser(user) {
  return instance
    .post("/pw/generate", user)
    .then((res) => {
      const token = res.data;
      return  {
        status: true,
        token: token
      };
    })
    .catch((err) => {
      alert(err.response.data.message);
      throw err;
    });
}

/**
 *
 * @param {Object} user user data to retrieve JWT from Fluree password auth API
 *  link to "pw/login" docs: https://docs.flur.ee/api/downloaded-endpoints/downloaded-examples#-login
 *
 */
export function loginFlureeUser(user) {
  return instance
    .post("/pw/login", user)
    .then((res) => {
      console.log("status", res.status);
      if (res.status === 200) {
        const token = res.data;
        return token;
      }
    })
    .catch((err) => {
      alert(err.response.data.message);
      throw err;
    });
}

// Check to see if ledger db exists in Fluree ledger
export function lookForDbs() {
  return new Promise((resolve, reject) => {
    axios
      .post(`http://localhost:${port}/fdb/dbs`)
      .then((res) => {
        // console.log("looking for dbs", res.data[0]);
        const databases = res.data;
        const dbName = ledger.split("/");
        for (let database of databases) {
          if (database.length === dbName.length) {
            if (database[0] === dbName[0] && database[1] === dbName[1]) {
              return resolve(true);
            }
          }
        }
        return resolve(false);
      })
      .catch((err) => reject("Make sure you're running Fluree!"));
  });
}

function delay(t, v) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

export function createNewDb(name) {
  return new Promise((resolve, reject) => {
    axios
      .post(`http://localhost:${port}/fdb/new-db`, { "db/id": name })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export function bootstrapDb(name) {
  console.log("is this working?");
  return createNewDb(name)
    .then((res) => delay(3000))
    // .then((res) => flureeTransact(functions))
    .then((res) => flureeTransact(rules))
    .then((res) => flureeTransact(schema))
    // .then((res) => flureeTransact(seed))
    .then((res) => {
      const message = "DB created";
      console.log(message);
      return message;
    })
    .catch((err) => err);
}

export default instance;
