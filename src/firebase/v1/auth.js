import { auth } from '@/firebase/firebase';
import {
  createUserWithEmailAndPassword, // 新規登録
  signInWithEmailAndPassword, // ログイン
  signOut, // ログアウト
  EmailAuthProvider, // 再認証に必要?
  reauthenticateWithCredential, // 再認証
  updateEmail, // email更新
  updatePassword, // password更新
  sendEmailVerification, // メールアドレス変更後確認メール送信
  sendPasswordResetEmail, // パスワードの再設定メール送信
  fetchSignInMethodsForEmail // 重複確認
} from "firebase/auth";

// ログイン中のユーザー情報を取得
export async function getCurrentUser() {
  const user = auth.currentUser;
  return user;
}

// メールアドレス重複チェック
async function checkEmailDuplicate(email) {
  try {
    const providers = await fetchSignInMethodsForEmail(auth, email);
    
    if (providers && providers.length > 0) {
      throw new Error("このメールアドレスは既に登録されています。");
    }
    return;
  } catch (error) {
    console.error("ユーザー登録エラーby Auth:", error.code, error.message);
    throw error; // throw: 呼び出し元に例外処理を投げる
  }
}

// 新規登録
export async function signUp(email, password) {
  try {
    // メールアドレスの重複確認
    await checkEmailDuplicate(email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error("ユーザー登録エラーby Auth:", error.code, error.message);
    throw error;
  }
}

// ログイン
export async function login(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return;
  } catch (error) {
    console.error('ログインエラーby Auth', error);
    throw error;
  }
}

// ログアウト
export async function logout() {
  try {
    await signOut(auth);
    return;
  } catch (error) {
    console.error('ログアウトエラーby Auth', error);
    throw error;
  }
}

// 再認証
async function reauthenticate(user, loginPassword) {
  try {
    const credential = EmailAuthProvider.credential(user.email, loginPassword);
    // console.log(credential);
    await reauthenticateWithCredential(user, credential);
    return;
  } catch (error) {
    console.error('ログアウトエラーby Auth', error);
    throw error;
  }
}

// メールアドレスを更新
export async function updateEmailByAuth(currentPassword, newEmail) {
  try {
    // メールアドレスの重複確認
    await checkEmailDuplicate(newEmail);

    const user = auth.currentUser;

    if (user) {
      // 再認証
      await reauthenticate(user, currentPassword)
      // メールアドレスを更新
      await updateEmail(user, newEmail);

      // 更新したメールアドレスに確認メールを送信
      await sendEmailVerification(user);

    } else {
      throw new Error("USER_NOT_LOGGED_IN");
    }
  } catch (error) {
    console.error("メールアドレスの更新エラーby Auth:", error);
    throw error;
  }
}

// パスワードを更新
export async function updatePasswordByAuth(currentPassword, newPassword) {
  try {
    const user = auth.currentUser;

    if (user) {
      // 再認証
      await reauthenticate(user, currentPassword)

      // パスワード更新
      await updatePassword(user, newPassword);
    } else {
      throw new Error("USER_NOT_LOGGED_IN");
    }
  } catch (error) {
    console.error("パスワードの更新エラーby Auth:", error);
    throw error;
  }
}

// パスワード再設定
export async function resetPassword() {
  try {
    const user = auth.currentUser;

    if (user) {
      await updatePassword(user, newPassword);
    } else {
      throw new Error("ユーザーがログインしていません。");
    }
  } catch (error) {
    console.error("パスワードの更新エラーby Auth:", error);
    throw error;
  }
}


// パスワード再発行
export async function reissuePassword(email) {
  try {
    // メールアドレスが登録されているか確認
    const providers = await fetchSignInMethodsForEmail(auth, email);

    if (providers && providers.length > 0) {
      await sendPasswordResetEmail(auth, email);
    } else {
      throw new Error("このメールアドレスは登録されていません。");
    }
  } catch (error) {
    console.error("パスワードの再設定エラーby Auth:", error);
    throw error;
  }
}

