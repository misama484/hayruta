//archivo que se encarga de la conexion con la base de datos y la gestion de los metodos get, post, put y delete en firebase

//DESARROLLAR CORRECTAMENTE -- CADA FICHERO DEBE ACCEDER A ESTE PARA LOPS METODOS CRUD

import firebase from 'firebase';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyD-9t7Pvz8b1l1fj0zC9vZJ9m5cM9hVh4g",
    authDomain: "crudreact-4a5f8.firebaseapp.com",
    databaseURL: "https://crudreact-4a5f8.firebaseio.com",
    projectId: "crudreact-4a5f8",
    storageBucket: "crudreact-4a5f8.appspot.com",
    messagingSenderId: "1055760673403",
    appId: "1:1055760673403:web:2e4f8b4f5b3f3b3f"
};

firebase.initializeApp(config);
const db = firebase.firestore();

export const getCollection = async (collection) => {
    const data = await db.collection(collection).get();
    const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return arrayData;
}

export const getDocument = async (collection, id) => {
    const data = await db.collection(collection).doc(id).get();
    return { id: data.id, ...data.data() };
}

export const addDocument = async (collection, data) => {
    const response = await db.collection(collection).add(data);
    return response;
}

export const updateDocument = async (collection, id, data) => {
    const response = await db.collection(collection).doc(id).update(data);
    return response;
}