import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { NativeToast } from "../screens/app/common/Toaster";
import i18n from "../../i18n";

export async function getApiHeaders() {
  const token = await AsyncStorage.getItem("jwt_token");
  // console.log(token);
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    // 'Content-Type': 'text/plain',
    lang: i18n.language
  };
  return headers;
}

// wrapper between our services and axios - on how to handle the request!
class ApiCall {
  static async get(url, body) {
    let headers = await getApiHeaders();
    try {
      const response = await axios.get(url, {
        headers: headers,
        params: JSON.stringify(body)
      });
      return await response.data;
    } catch (err) {
      console.log(url, err, "response from ApI");

      if (err && err.response && err.response.data) {
        throw err.response.data;
      } else {
        throw err;
      }
    }
  }

  static async getBody(url, body) {
    let headers = await getApiHeaders();
    try {
      const response = await axios.get(url, {
        headers: headers,
        body: JSON.stringify(body)
      });
      return await response.data;
    } catch (err) {
      if (err && err.response && err.response.data) {
        throw err.response.data;
      } else {
        throw err;
      }
    }
  }

  static async post(url, payload, header) {
    let headers = await getApiHeaders();
    headers = { ...headers, header };
    try {
      const response = await axios.post(url, payload, { headers: headers });
      // console.log(response, "response post");
      return response.data == undefined ? response : response.data;
    } catch (err) {
      // console.log(err, 'errorrrrr');
      if (err && err.response && err.response.data) {
        throw err.response.data;
      } else {
        throw err;
      }
    }
  }

  static async postMultiForm(url, payload, header) {
    try {
      const response = await axios.post(url, payload, { headers: header });
      return response.data == undefined ? response : response.data;
    } catch (err) {
      // console.log(err, 'errorrrrr');
      if (err && err.response && err.response.data) {
        throw err.response.data;
      } else {
        throw err;
      }
    }
  }

  static async put(url, payload) {
    let headers = await getApiHeaders();
    try {
      const response = await axios.put(url, payload, { headers: headers });
      return response.data;
    } catch (err) {
      if (err && err.response && err.response.data) {
        throw err.response.data;
      } else {
        throw err;
      }
    }
  }

  static async delete(url) {
    let headers = await getApiHeaders();
    try {
      const response = await axios.delete(url, { headers: headers });
      return response.data;
    } catch (err) {
      if (err && err.response && err.response.data) {
        throw err.response.data;
      } else {
        throw err;
      }
    }
  }

  // To be modified before use based on this project's requirement
  static async getDoc(url) {
    let headers = await getApiHeaders();
    try {
      const response = await axios.get(url, {
        headers: headers,
        responseType: "blob"
      });
      return response.data;
    } catch (err) {
      if (err && err.response && err.response.data) {
        throw err.response.data;
      } else {
        throw err;
      }
    }
  }

  // To be modified before use based on this project's requirement
  static async postDoc(url, payload) {
    let headers = await getApiHeaders();
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: payload?.path,
        name: "test.jpeg",
        type: payload?.mime
      });
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data;"
        }
      });
      return response.data;
    } catch (err) {
      if (err && err.response && err.response.data) {
        throw err;
      } else {
        throw err;
      }
    }
  }

  // To be modified before use based on this project's requirement
  static async postMultipleDoc(url, payload) {
    let headers = await getApiHeaders();
    const formData = new FormData();
    if (payload) {
      for (let i = 0; i < payload.length; i++) {
        formData.append("files", {
          uri: payload[i]?.path,
          name: payload[i]?.path.substring(
            payload[i].path.lastIndexOf("/") + 1
          ),
          type: payload[i]?.mime
        });
      }
    }
    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data;"
        }
      });
      return response.data;
    } catch (err) {
      if (err && err.response && err.response.data) {
        throw err;
      } else {
        throw err;
      }
    }
  }

  // To be modified before use based on this project's requirement
  static async deleteDoc(url) {
    let headers = await getApiHeaders();
    try {
      const response = await axios.delete(url);
      return response.data;
    } catch (err) {
      if (err && err.response && err.response.data) {
        throw err;
      } else {
        throw err;
      }
    }
  }

  // To be modified before use based on this project's requirement
  static async deleteDocById(url, values) {
    let headers = await getApiHeaders();
    try {
      const response = await axios.delete(url, {
        data: {
          id: values.id
        }
      });
      return response.data;
    } catch (err) {
      if (err && err.response && err.response.data) {
        throw err;
      } else {
        throw err;
      }
    }
  }
}
export default ApiCall;
