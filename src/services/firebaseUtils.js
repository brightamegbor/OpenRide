import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    signInWithEmailAndPassword,
    signOut
 } from "firebase/auth";

 import firebase from '../firebase';
import { getFirestore, collection, 
    getDocs, addDoc, doc, updateDoc, query, where} from 'firebase/firestore/lite';
import { getStorage, ref, uploadBytesResumable  } from "firebase/storage";

const auth = getAuth();

export function signUpWithEmail(email, password) {
    return new Promise((resolve) =>
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            resolve(user);
        })
        .catch((error) => {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            resolve(error);
        })
    );
}

export function signInWithEmail(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            return user;
        })
        .catch((error) => {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            return error;
        });
}

export function signOutUser() {
    return new Promise(resolve => signOut(auth)
        .then((result) => {
            resolve(result);
        })
    )
}

const appVerifier = window.recaptchaVerifier;

export function signUpWithPhone(phoneNumber) {
    // TODO: not complete
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            // ...
        }).catch((error) => {
            // Error; SMS not sent
            // ...
        });
}

export function recaptchaVerify(phoneNumber) {
    window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
        'size': 'invisible',
        'callback': (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            signUpWithPhone(phoneNumber);
        },
        'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            recaptchaVerify(phoneNumber)
        }
    }, auth);
}

// -- upload to storage --
export function uploadImageToStorage(childReference, file, imageName) {
    const metadata = {
        contentType: 'image/jpeg',
    };

    const storage = getStorage(firebase);
    // Create a storage reference from our storage service
    const storageRef = ref(storage, "images/" + childReference + "/" + imageName);

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    return uploadTask;

}

// -- end upload to storage --

// firebase cloud firestore
const _firestoreUsersDB = getFirestore(firebase);
const usersCol = collection(_firestoreUsersDB, 'users');

class firebaseCRUDService {

    async saveUserProfile(data) {
        const userSnapshot = await addDoc(usersCol, data);
        return userSnapshot;
    }

    async getAllUserProfile() {
        const usersSnapshot = await getDocs(usersCol);
        const usersList = usersSnapshot.docs.map(doc => doc.data());
        return usersList;
    }

    async updateUserProfile(data, uid) {
        const que = query(usersCol, where("uid", "==", uid));
        const querySnapshot = await getDocs(que);
        
        var updateRef;
        // console.log(uid);
        // console.log(querySnapshot);
        querySnapshot.forEach(async (doc) => {
            updateRef = doc.ref;
        });
        const updateTask = await updateDoc(updateRef, data);


        return updateTask;
    }

    deleteUserProfile(id) {
        return _firestoreUsersDB.doc(id).delete();
    }
}

export default new firebaseCRUDService();