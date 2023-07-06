import axios from "axios";

// this fetch functions are created to be used with react-query
const tkFetch = {
  get(url, options) {
    return () =>
      axios
        .get(url, options)
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          return res.data.data;
        })
        .catch((err) => {
          // status code is not between 200 and 300 , then axiois throws an error, we catch it and throw our message that we have returned from the server
          const resData = err.response?.data;
          if (resData && resData.message) {
            throw new Error(resData.message);
          } else {
            throw new Error("Something went wrong on our side. Please try again later.");
          }
        });
  },

  post(url, options) {
    return (body) =>
      axios
        .post(url, body, options)
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          return res.data.data;
        })
        .catch((err) => {
          // status code is not between 200 and 300 , then axiois throws an error, we catch it and throw our message that we have returned from the server
          const resData = err.response?.data;
          if (resData && resData.message) {
            throw new Error(resData.message);
          } else {
            throw new Error("Something went wrong on our side. Please try again later.");
          }
        });
  },

  postWithId(url, options) {
    return async (body) => {
      if (!body.id) {
        throw new Error("Id is required, for post with ID function");
      }
      try {
        const res = await axios.post(url + `/${body.id}`, body, options);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.data;
      } catch (err) {
        // status code is not between 200 and 300 , then axiois throws an error, we catch it and throw our message that we have returned from the server
        const resData = err.response?.data;
        if (resData && resData.message) {
          throw new Error(resData.message);
        } else {
          throw new Error("Something went wrong on our side. Please try again later.");
        }
      }
    };
  },

  delete(url, options) {
    return () =>
      axios
        .delete(url, options)
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          return res.data.data;
        })
        .catch((err) => {
          // status code is not between 200 and 300 , then axiois throws an error, we catch it and throw our message that we have returned from the server
          const resData = err.response?.data;
          if (resData && resData.message) {
            throw new Error(resData.message);
          } else {
            throw new Error("Something went wrong on our side. Please try again later.");
          }
        });
  },

  deleteWithIdInUrl(url, options) {
    return async (data) => {
      if (!data.id) {
        throw new Error("Id is required, for delete with ID function");
      }
      try {
        const res = await axios.delete(url + `/${data.id}`, options);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.data;
      } catch (err) {
        // status code is not between 200 and 300 , then axiois throws an error, we catch it and throw our message that we have returned from the server
        const resData = err.response?.data;
        if (resData && resData.message) {
          throw new Error(resData.message);
        } else {
          throw new Error("Something went wrong on our side. Please try again later.");
        }
      }
    };
  },

  deleteWithIdsInUrl(url, options) {
    return async (data) => {
      console.log("data", data)
      if (!data.id) {
        throw new Error("Id is required, for delete with ID function");
      }
      try {
        const res = await axios.delete(url + `/${data.id}/${data.integrationId}/${data.userId}/${data.mappedRecord}`, options);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.data;
      } catch (err) {
        console.log("err", err)
        // status code is not between 200 and 300 , then axiois throws an error, we catch it and throw our message that we have returned from the server
        const resData = err.response?.data;
        if (resData && resData.message) {
          throw new Error(resData.message);
        } else {
          throw new Error("Something went wrong on our side. Please try again later.");
        }
      }
    };
  },

  // deleteWithId(url, options) {
  //   if (!id) {
  //     throw new Error("Id is required, for delete with ID function");
  //   }
  //   return async (id) => {
  //     try {
  //       const res = await axios.delete(url + `/${id}`, options);
  //       if (!res.data.success) {
  //         throw new Error(res.data.message);
  //       }
  //       return res.data.data;
  //     } catch (err) {
  //       // status code is not between 200 and 300 , then axiois throws an error, we catch it and throw our message that we have returned from the server
  //       const resData = err.response?.data;
  //       if (resData && resData.message) {
  //         throw new Error(resData.message);
  //       } else {
  //         throw new Error("Something went wrong on our side. Please try again later.");
  //       }
  //     }
  //   };
  // },

  patch(url, options) {
    return (body) =>
      axios
        .patch(url, body, options)
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          return res.data.data;
        })
        .catch((err) => {
          // status code is not between 200 and 300 , then axiois throws an error, we catch it and throw our message that we have returned from the server
          const resData = err.response?.data;
          if (resData && resData.message) {
            throw new Error(resData.message);
          } else {
            throw new Error("Something went wrong on our side. Please try again later.");
          }
        });
  },

  patchWithId(url, options) {
    return async (body) => {
      if (!body.id) {
        throw new Error("Id is required, for patch with ID function");
      }
      try {
        const res = await axios.patch(url + `/${body.id}`, body, options);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.data;
      } catch (err) {
        // status code is not between 200 and 300 , then axiois throws an error, we catch it and throw our message that we have returned from the server
        const resData = err.response?.data;
        if (resData && resData.message) {
          throw new Error(resData.message);
        } else {
          throw new Error("Something went wrong on our side. Please try again later.");
        }
      }
    };
  },

  put(url, options) {
    return (body) =>
      axios
        .put(url, body, options)
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          return res.data.data;
        })
        .catch((err) => {
          // status code is not between 200 and 300 , then axiois throws an error, we catch it and throw our message that we have returned from the server
          const resData = err.response?.data;
          if (resData && resData.message) {
            throw new Error(resData.message);
          } else {
            throw new Error("Something went wrong on our side. Please try again later.");
          }
        });
  },

  // putWithId(url, options) {
  //   return async (body) => {
  //     if (!body.id) {
  //       throw new Error("Id is required, for put with ID function");
  //     }
  //     try {
  //       const res = await axios.put(url + `/${body.id}`, body, options);
  //       if (!res.data.success) {
  //         throw new Error(res.data.message);
  //       }
  //       return res.data.data;
  //     } catch (err) {
  //       // status code is not between 200 and 300 , then axiois throws an error, we catch it and throw our message that we have returned from the server
  //       const resData = err.response?.data;
  //       if (resData && resData.message) {
  //         throw new Error(resData.message);
  //       } else {
  //         throw new Error("Something went wrong on our side. Please try again later.");
  //       }
  //     }
  //   };
  // },
  putWithIdInUrl(url, options) {
    return async (body) => {
      if (!body.id) {
        throw new Error("Id is required, for put with ID function");
      }
      try {
        const res = await axios.put(url + `/${body.id}`, body, options);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data.data;
      } catch (err) {
        // status code is not between 200 and 300 , then axiois throws an error, we catch it and throw our message that we have returned from the server
        const resData = err.response?.data;
        if (resData && resData.message) {
          throw new Error(resData.message);
        } else {
          throw new Error("Something went wrong on our side. Please try again later.");
        }
      }
    };
  },
};

export default tkFetch;
