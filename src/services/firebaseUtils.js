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
    getDocs, addDoc, updateDoc, query, where} from 'firebase/firestore/lite';
import { getStorage, ref, uploadBytesResumable  } from "firebase/storage";
import { getDatabase, ref as dbRef, 
    query as dbQuery, orderByChild, equalTo, set } from "firebase/database";

const auth = getAuth();
const storage = getStorage(firebase);
const database = getDatabase(firebase);

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
    return new Promise((resolve) => 
    signInWithEmailAndPassword(auth, email, password)
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

export function signOutUser() {
    return new Promise(resolve => signOut(auth)
        .then((result) => {
            resolve(result);
        })
    )
}

const appVerifier = window.recaptchaVerifier;

export function signUpWithPhone(phoneNumber) {
    return new Promise(resolve =>
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            // window.confirmationResult = confirmationResult;
            resolve(confirmationResult);
            // ...
        }).catch((error) => {
            // Error; SMS not sent
            // ...
            resolve(error);
        })
    );
}

export function recaptchaVerify(phoneNumber) {
    window.recaptchaVerifier = new RecaptchaVerifier('phone-next-btn', {
        'size': 'invisible',
        'callback': (response) => {
            console.log(response);
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

    // const storage = getStorage(firebase);
    // Create a storage reference from our storage service
    const storageRef = ref(storage, "images/" + childReference + "/" + imageName);

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    return uploadTask;

}

// -- end upload to storage --

// firebase cloud firestore
const _firestoreUsersDB = getFirestore(firebase);
const usersCol = collection(_firestoreUsersDB, 'users');


 // -- get ride list --
 export function getRideList() {
    return dbQuery(dbRef(database, 'rides'), orderByChild('status'), equalTo(0));
 }

 // -- get ride list --
 export function currentRideUtil(currentRide) {
    return dbRef(database, `rides/${currentRide.rideUuid}`);
 }

 // -- created ride --
 export function createdRideUtil(rideRequest) {
    return dbRef(database, `rides/${rideRequest.rideUuid}`);
 }

 // -- accept ride --
 export function acceptRideDB(request) {
    return set(dbRef(database, `rides/${request.rideUuid}`), request);
 }

 // -- create ride --
 export function createRideDB(rideUuid, ride) {
    return set(dbRef(database, `rides/${rideUuid}`), ride);
 }

 // -- update ride --
 export function updateRideDB(ride) {
    return set(dbRef(database, `rides/${ride.rideUuid}`), ride);
 }


class firebaseCRUDService {

    async saveUserProfile(data) {
        const userSnapshot = await addDoc(usersCol, data);
        return userSnapshot;
    }

    async getDriverUserProfile(email) {
        const que = query(usersCol, where("email", "==", email));
        const querySnapshot = await getDocs(que);
        var userSnapshot;

        querySnapshot.forEach((doc) => {
            userSnapshot = doc.data()
        });

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
        if (querySnapshot !== undefined) {
            querySnapshot.forEach(async (doc) => {
                updateRef = doc.ref;
            });
        }

        if (updateRef === undefined) {
            const createIfNotExit = await this.saveUserProfile(data);
            updateRef = createIfNotExit;
        }
        const updateTask = await updateDoc(updateRef, data);


        return updateTask;
    }

    deleteUserProfile(id) {
        return _firestoreUsersDB.doc(id).delete();
    }
}

export default new firebaseCRUDService();