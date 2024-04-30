import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { initializeApp } from "firebase/app";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const firebaseConfig = {
  apiKey: "AIzaSyDxbPcazMlMBcCsRs6Zd71K3A819j4LLDk",
  authDomain: "hayruta-b2acb.firebaseapp.com",
  projectId: "hayruta-b2acb",
  storageBucket: "hayruta-b2acb.appspot.com",
  messagingSenderId: "540727552149",
  appId: "1:540727552149:web:fdb649cb8e28c0e73f539c"
};

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})