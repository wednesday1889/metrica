import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.firestore();
        this.functions = app.functions();
        this.Timestamp = app.firestore.Timestamp;
    }

    onAuthUserListener = (next, fallback) => {
        const _self = this;
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                _self
                    .user(authUser.uid)
                    .get()
                    .then(doc => {
                        const dbUser = doc.data();

                        // default empty roles
                        if (!dbUser.roles) {
                            dbUser.roles = [];
                        }

                        // merge auth and db user
                        const authUserMergedWithAuth = {
                            uid: authUser.uid,
                            email: authUser.email,
                            ...dbUser
                        };

                        _self
                            .candidateStatus(authUser.email)
                            .get()
                            .then(candDoc => {
                                const candidateStatus = candDoc.data();
                                const authUserMergedWithCandidate = {
                                    ...authUserMergedWithAuth,
                                    ...candidateStatus
                                };
                                next(authUserMergedWithCandidate);
                            });
                    });
            } else {
                fallback();
            }
        });
    };
    // *** Auth API ***

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    user = uid => this.db.collection("users").doc(uid);

    users = () => this.db.collection("users");

    candidateStatus = email => this.db.collection("candidatestatus").doc(email);

    exam = email => this.db.collection("exams").doc(email);

    // google cloud functions

    saveProfile = () => this.functions.httpsCallable("saveProfile");

    generateExam = () => this.functions.httpsCallable("generateExam");
}

export default Firebase;
