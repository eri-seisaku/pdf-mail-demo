import { db } from '@/firebase/firebase';
import {
  collection,
  doc,
  setDoc, // 登録(上書き)
  addDoc, // 登録(追加)
  getDoc, // 取得
  getDocs, // 全て取得
  updateDoc, // 更新
  writeBatch, // バッチ処理(複数の書き込み)
  // arrayUnion // 配列内の一意の値を追加
} from "firebase/firestore";
// import { array } from 'yup';

// 更新 - 特定 - 1階層
export async function updateOneLevelData(userID, collectionName, arrayData) {
  try {
    const docRef = doc(db, collectionName, userID);

    await updateDoc(docRef, arrayData);
  } catch (error) {
    console.error("更新エラーby Firestore:", error);
    throw error;
  }
}

// 新規(上書き) - 1階層(ドキュメントIDを指定して保存SignUp.vue用)
export async function setOneLevelData(userID, collectionName, arrayData) {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = doc(collectionRef, userID);

    await setDoc(docRef, arrayData);

  } catch (error) {
    console.error("保存エラーby Firestore:", error);
    throw error; // throw: 呼び出し元に例外処理を投げる
  }
}

// 上書き - 特定 - 複数 - 1階層
export async function updateOneLevelMultipleData(collectionName, multipleArrayData) {
  try {
    const batch = writeBatch(db);

    multipleArrayData.forEach((userData) => {
      const docRef = doc(db, collectionName, userData.memberID);
      batch.set(docRef, userData, {merge: true});
    });

    await batch.commit();
  } catch (error) {
    console.error("更新エラーby Firestore:", error);
    throw error;
  }
}

// 追加 - 特定 - 1階層
export async function addOneLevelData(collectionName, arrayData) {
  try {
    const collectionRef = collection(db, collectionName);

    await addDoc(collectionRef, arrayData);
  } catch (error) {
    console.error("保存エラーby Firestore:", error);
    throw error;
  }
}

// 追加 - 特定 - 2階層
export async function addTwoLevelData(userID, arrayData, firstCollectionName, secondCollectionName) {
  try {
    const docRef = doc(db, firstCollectionName, userID);
    const collectionRef = collection(docRef, secondCollectionName);

    // await addDoc(collectionRef, arrayData);
    // 2階層目のドキュメントIDを返す
    const secondDocRef = await addDoc(collectionRef, arrayData);

    return secondDocRef.id;

  } catch (error) {
    console.error("保存エラーby Firestore:", error);
    throw error;
  }
}

// 取得 - 特定 - 1階層
export async function getOneLevelData(userID, collectionName) {
  try {
    const docRef = doc(db, collectionName, userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("データが見つかりません");
    }
  } catch (error) {
    console.error('取得エラーby Firestore', error);
    throw error;
  }
}

// 取得 - 特定 - 2階層
export async function getTwoLevelData(userID, docID, firstCollectionName, secondCollectionName) {
  try {
    const firstDocRef = doc(db, firstCollectionName, userID);
    const collectionRef = collection(firstDocRef, secondCollectionName);

    const secondDocRef = doc(collectionRef, docID);
    const docSnap = await getDoc(secondDocRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("データが見つかりません");
    }
  } catch (error) {
    console.error('取得エラーby Firestore', error);
    throw error;
  }
}


// 取得 - 全 - 1階層(コレクション名-ドキュメント名-フィールド)
export async function getOneLevelAllData(collectionName) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const allData = [];

    querySnapshot.forEach((doc) => {
      allData.push(doc.data())
    });

    return allData;
  } catch (error) {
    console.error('取得エラーby Firestore:', error);
    throw error;
  }
}

// 取得 - 全 - 2階層(コレクション名-ドキュメント名-コレクション名-ドキュメント名-フィールド)
export async function getTwoLevelAllData(userID, firstCollectionName, secondCollectionName) {
  try {
    const docRef = doc(db, firstCollectionName, userID);
    const collectionRef = collection(docRef, secondCollectionName);

    const querySnapshot = await getDocs(collectionRef);
    const allData = [];

    querySnapshot.forEach((doc) => {
      allData.push({ id: doc.id, ...doc.data() }); // IDも一緒に
      // allData.push(doc.data()); // IDなし
    });

    return allData;
  } catch (error) {
    console.error('取得エラーby Firestore:', error);
    throw error;
  }
}
