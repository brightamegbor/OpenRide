import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    signInWithEmailAndPassword
 } from "firebase/auth";

const auth = getAuth();

export function signUpWithEmail(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
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